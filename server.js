require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

const ALLOWED_MODULES = [
  "add_story",
  "view_story",
  "view_scheduled_story",
  "epaper",
  "create_poll",
  "video_list",
  "contact_list",
  "user_access_management",
];

async function setupDatabase() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      ) ENGINE=InnoDB;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(150) UNIQUE,
        password VARCHAR(150),
        role_id INT,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      ) ENGINE=InnoDB;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role_id INT NOT NULL,
        permission_key VARCHAR(100) NOT NULL,
        UNIQUE KEY ux_role_permission (role_id, permission_key),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    const [roleRows] = await conn.query("SELECT id FROM roles WHERE name = 'admin'");
    let adminRoleId;

    if (roleRows.length === 0) {
      const [result] = await conn.query("INSERT INTO roles (name) VALUES ('admin')");
      adminRoleId = result.insertId;
      console.log("Admin role created:", adminRoleId);
    } else {
      adminRoleId = roleRows[0].id;
    }

    const [userRows] = await conn.query("SELECT id FROM users WHERE username = 'admin'");
    if (userRows.length === 0) {
      const defaultPass = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";
      await conn.query(
        "INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)",
        ["admin", defaultPass, adminRoleId]
      );
      console.log("\nDefault admin created:");
      console.log("Username: admin");
      console.log("Password:", defaultPass, "\n");
    } else {
      console.log("Admin user already exists.");
    }

  } finally {
    conn.release();
  }
}
async function loadRolesWithModules() {
  const conn = await pool.getConnection();
  try {
    const [roles] = await conn.query("SELECT id, name FROM roles ORDER BY id ASC");
    if (!roles.length) return [];

    const roleIds = roles.map(r => r.id);
    const placeholders = roleIds.map(() => "?").join(",");
    const [perms] = await conn.query(
      `SELECT role_id, permission_key FROM role_permissions WHERE role_id IN (${placeholders})`,
      roleIds
    );

    const permMap = {};
    for (const p of perms) {
      if (!permMap[p.role_id]) permMap[p.role_id] = [];
      permMap[p.role_id].push(p.permission_key);
    }

    return roles.map(r => ({
      id: r.id,
      name: r.name,
      modules: permMap[r.id] || [],
    }));
  } finally {
    conn.release();
  }
}
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/roles", async (req, res) => {
  try {
    const roles = await loadRolesWithModules();
    return res.json(roles);
  } catch (err) {
    console.error("GET /api/roles error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/roles", async (req, res) => {
  const { name, modules } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Role name is required" });
  }
  const trimmedName = name.trim();

  if (!Array.isArray(modules)) {
    return res.status(400).json({ error: "modules must be an array" });
  }

  const uniqueModules = Array.from(new Set(modules));
  for (const m of uniqueModules) {
    if (!ALLOWED_MODULES.includes(m)) {
      return res.status(400).json({ error: `Invalid module key: ${m}` });
    }
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [ins] = await conn.query("INSERT INTO roles (name) VALUES (?)", [trimmedName]);
    const newRoleId = ins.insertId;

    if (uniqueModules.length > 0) {
      const placeholders = uniqueModules.map(() => "(?, ?)").join(", ");
      const params = [];
      uniqueModules.forEach(m => {
        params.push(newRoleId, m);
      });

      await conn.query(
        `INSERT INTO role_permissions (role_id, permission_key) VALUES ${placeholders}`,
        params
      );
    }

    await conn.commit();
    return res.status(201).json({ id: newRoleId, name: trimmedName, modules: uniqueModules });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      await conn.rollback();
      return res.status(409).json({ error: "Role name already exists" });
    }
    console.error("POST /api/roles error:", err);
    await conn.rollback();
    return res.status(500).json({ error: "Server error while creating role" });

  } finally {
    conn.release();
  }
});

app.put("/api/roles/:id", async (req, res) => {
  const roleId = parseInt(req.params.id, 10);
  const { name, modules } = req.body;

  if (!roleId || isNaN(roleId)) {
    return res.status(400).json({ error: "Invalid role id" });
  }

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Role name is required" });
  }
  const trimmedName = name.trim();

  if (!Array.isArray(modules)) {
    return res.status(400).json({ error: "modules must be an array" });
  }

  const uniqueModules = Array.from(new Set(modules));
  for (const m of uniqueModules) {
    if (!ALLOWED_MODULES.includes(m)) {
      return res.status(400).json({ error: `Invalid module key: ${m}` });
    }
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [existing] = await conn.query("SELECT id FROM roles WHERE id = ?", [roleId]);
    if (existing.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Role not found" });
    }

    const [nameClash] = await conn.query(
      "SELECT id FROM roles WHERE name = ? AND id != ?",
      [trimmedName, roleId]
    );
    if (nameClash.length > 0) {
      await conn.rollback();
      return res.status(409).json({ error: "Role name already exists" });
    }

    await conn.query("UPDATE roles SET name = ? WHERE id = ?", [trimmedName, roleId]);

    await conn.query("DELETE FROM role_permissions WHERE role_id = ?", [roleId]);

    if (uniqueModules.length > 0) {
      const placeholders = uniqueModules.map(() => "(?, ?)").join(", ");
      const params = [];
      uniqueModules.forEach(m => {
        params.push(roleId, m);
      });

      await conn.query(
        `INSERT INTO role_permissions (role_id, permission_key) VALUES ${placeholders}`,
        params
      );
    }

    await conn.commit();

    return res.json({
      id: roleId,
      name: trimmedName,
      modules: uniqueModules,
    });

  } catch (err) {
    console.error("PUT /api/roles/:id error:", err);
    await conn.rollback();
    return res.status(500).json({ error: "Server error while updating role" });

  } finally {
    conn.release();
  }
});
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT u.id, u.username, u.password, r.name AS role
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.username = ?`,
      [username]
    );

    if (rows.length === 0)
      return res.status(401).json({ error: "Invalid username or password" });

    const user = rows[0];

    if (user.password !== password)
      return res.status(401).json({ error: "Invalid username or password" });

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });

  } finally {
    conn.release();
  }
});

setupDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log("Allowed modules:", ALLOWED_MODULES.join(", "));
    });
  })
  .catch(err => {
    console.error("Setup error:", err);
    process.exit(1);
  });
