require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const path = require("path");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "src/uploads/users"));
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files allowed"), false);
    } else {
      cb(null, true);
    }
  },
});

const storyStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "src/uploads/story"));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  },
});

const uploadStory = multer({
  storage: storyStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files allowed"), false);
    } else {
      cb(null, true);
    }
  },
});

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
        password VARCHAR(150) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(150) UNIQUE,
        phone VARCHAR(30) UNIQUE,
        profile_image VARCHAR(255),
        bio TEXT,
        designation VARCHAR(100),
        job_type VARCHAR(100),
        reporting_manager_id INT,
        role_id INT NOT NULL,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (reporting_manager_id) REFERENCES users(id)
      ) ENGINE=InnoDB;
    `);

    const [columns] = await conn.query(`
      SHOW COLUMNS FROM users
    `);

    const existingColumns = columns.map(c => c.Field);

    const addColumnIfMissing = async (name, sql) => {
      if (!existingColumns.includes(name)) {
        console.log(`Adding column: ${name}`);
        await conn.query(sql);
      }
    };

    await addColumnIfMissing(
      "first_name",
      "ALTER TABLE users ADD COLUMN first_name VARCHAR(100)"
    );

    await addColumnIfMissing(
      "last_name",
      "ALTER TABLE users ADD COLUMN last_name VARCHAR(100)"
    );

    await addColumnIfMissing(
      "email",
      "ALTER TABLE users ADD COLUMN email VARCHAR(150) UNIQUE"
    );

    await addColumnIfMissing(
      "phone",
      "ALTER TABLE users ADD COLUMN phone VARCHAR(30) UNIQUE"
    );

    await addColumnIfMissing(
      "is_active",
      "ALTER TABLE users ADD COLUMN is_active TINYINT(1) DEFAULT 1"
    );

    await addColumnIfMissing(
      "reporting_manager_id",
      "ALTER TABLE users ADD COLUMN reporting_manager_id INT"
    );

    await addColumnIfMissing(
      "designation",
      "ALTER TABLE users ADD COLUMN designation VARCHAR(100)"
    );

    await addColumnIfMissing(
      "job_type",
      "ALTER TABLE users ADD COLUMN job_type VARCHAR(100)"
    );

    await addColumnIfMissing(
      "bio",
      "ALTER TABLE users ADD COLUMN bio TEXT"
    );

    await addColumnIfMissing(
      "profile_image",
      "ALTER TABLE users ADD COLUMN profile_image VARCHAR(255)"
    );


    await conn.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role_id INT NOT NULL,
        permission_key VARCHAR(100) NOT NULL,
        UNIQUE KEY ux_role_permission (role_id, permission_key),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    const [roleRows] = await conn.query(
      "SELECT id FROM roles WHERE name = 'admin'"
    );

    let adminRoleId;
    if (roleRows.length === 0) {
      const [res] = await conn.query(
        "INSERT INTO roles (name) VALUES ('admin')"
      );
      adminRoleId = res.insertId;
      console.log("Admin role created");
    } else {
      adminRoleId = roleRows[0].id;
    }

    const [userRows] = await conn.query(
      "SELECT id FROM users WHERE username = 'admin'"
    );

    if (userRows.length === 0) {
      const defaultPass = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";
      await conn.query(
        `
        INSERT INTO users
        (username, password, role_id)
        VALUES (?, ?, ?)
        `,
        ["admin", defaultPass, adminRoleId]
      );

      console.log("\nDefault admin created:");
      console.log("Username: admin");
      console.log("Password:", defaultPass, "\n");
    } else {
      console.log("Admin user already exists.");
    }

    await conn.query(`
      CREATE TABLE IF NOT EXISTS stories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        author VARCHAR(150) NULL,
        story_url TEXT,
        short_title TEXT,
        article_title TEXT,
        slug_intro TEXT,
        topic_tags TEXT,
        description LONGTEXT,
        district VARCHAR(255),
        mandal VARCHAR(255),
        status ENUM('draft','published','not_published') DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

  } finally {
    conn.release();
  }
}

async function loadRolesWithModules() {
  const conn = await pool.getConnection();
  try {
    const [roles] = await conn.query(
      "SELECT id, name FROM roles ORDER BY id ASC"
    );
    if (!roles.length) return [];

    const roleIds = roles.map((r) => r.id);
    const placeholders = roleIds.map(() => "?").join(",");

    const [perms] = await conn.query(
      `
      SELECT role_id, permission_key
      FROM role_permissions
      WHERE role_id IN (${placeholders})
      `,
      roleIds
    );

    const permMap = {};
    perms.forEach((p) => {
      if (!permMap[p.role_id]) permMap[p.role_id] = [];
      permMap[p.role_id].push(p.permission_key);
    });

    return roles.map((r) => ({
      id: r.id,
      name: r.name,
      modules: permMap[r.id] || [],
    }));
  } finally {
    conn.release();
  }
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/roles", async (req, res) => {
  try {
    const roles = await loadRolesWithModules();
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/roles", async (req, res) => {
  const { name, modules } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Role name is required" });
  }

  if (!Array.isArray(modules)) {
    return res.status(400).json({ error: "modules must be an array" });
  }

  const uniqueModules = [...new Set(modules)];
  for (const m of uniqueModules) {
    if (!ALLOWED_MODULES.includes(m)) {
      return res.status(400).json({ error: `Invalid module: ${m}` });
    }
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      "INSERT INTO roles (name) VALUES (?)",
      [name.trim()]
    );
    const roleId = result.insertId;

    if (uniqueModules.length > 0) {
      const values = uniqueModules.map(() => "(?, ?)").join(", ");
      const params = [];
      uniqueModules.forEach((m) => params.push(roleId, m));

      await conn.query(
        `INSERT INTO role_permissions (role_id, permission_key) VALUES ${values}`,
        params
      );
    }

    await conn.commit();

    res.status(201).json({
      id: roleId,
      name: name.trim(),
      modules: uniqueModules,
    });
  } catch (err) {
    await conn.rollback();
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Role already exists" });
    } else {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  } finally {
    conn.release();
  }
});

app.get("/api/users", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(`
      SELECT
        u.id,
        CONCAT_WS(' ', u.first_name, u.last_name) AS name,
        u.email,
        u.phone,
        u.bio,
        r.name AS role
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.is_active = 1
      ORDER BY u.id DESC
    `);

    res.json(rows);
  } finally {
    conn.release();
  }
});
app.get("/api/users/managers", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(`
      SELECT
        id,
        COALESCE(
          NULLIF(CONCAT_WS(' ', first_name, last_name), ''),
          email,
          username
        ) AS name,
        email
      FROM users
      WHERE is_active = 1
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Managers fetch error:", err);
    res.status(500).json({ error: "Failed to load managers" });
  } finally {
    conn.release();
  }
});

app.get("/api/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `
      SELECT
        id,
        username,
        first_name,
        last_name,
        email,
        phone,
        profile_image,
        bio,
        designation,
        job_type,
        reporting_manager_id,
        role_id,
        is_active
      FROM users
      WHERE id = ?
    `,
      [userId]
    );

    if (!rows.length) return res.status(404).json({ error: "User not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    conn.release();
  }
});


app.post("/api/users", upload.single("profile_image"), async (req, res) => {
  const profileImagePath = req.file
    ? `uploads/users/${req.file.filename}`
    : null;

  const {
    username,
    password,
    first_name,
    last_name,
    email,
    phone,
    bio,
    designation,
    job_type,
    reporting_manager_id,
    role_id,
  } = req.body;

  if (!password || !role_id) {
    return res.status(400).json({
      error: "password and role_id are required",
    });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `
      INSERT INTO users
      (username, password, first_name, last_name, email, phone,profile_image, bio,
       designation, job_type, reporting_manager_id, role_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        username || email,
        password,
        first_name || null,
        last_name || null,
        email || null,
        phone || null,
        profileImagePath,
        bio || null,
        designation || null,
        job_type || null,
        reporting_manager_id || null,
        role_id,
      ]
    );

    await conn.commit();
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "User already exists" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  } finally {
    conn.release();
  }
});

app.post("/api/users/:id/photo", upload.single("profile_image"), async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  console.log(`POST /api/users/${req.params.id}/photo hit`);
  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const profileImagePath = `uploads/users/${req.file.filename}`;
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `UPDATE users SET profile_image = ? WHERE id = ?`,
      [profileImagePath, userId]
    );

    res.json({ profile_image: profileImagePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile image" });
  } finally {
    conn.release();
  }
});

app.post("/api/story/upload-image", uploadStory.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const pathUrl = `uploads/story/${req.file.filename}`;
  res.json({ path: pathUrl });
});

app.post("/api/stories", async (req, res) => {
  const {
    user_id,
    author,
    story_url,
    short_title,
    article_title,
    slug_intro,
    topic_tags,
    description,
    district,
    mandal,
    status,
  } = req.body;

  if (!story_url || !short_title || !article_title) {
    return res.status(400).json({ error: "story_url, short_title and article_title are required" });
  }

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO stories
      (user_id, author, story_url, short_title, article_title, slug_intro, topic_tags, description, district, mandal, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id || null,
        author || null,
        story_url,
        short_title,
        article_title,
        slug_intro || null,
        topic_tags || null,
        description || null,
        district || null,
        mandal || null,
        status || "draft",
      ]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    conn.release();
  }
});

// List stories
app.get("/api/stories", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT * FROM stories ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    conn.release();
  }
});

app.get("/api/stories/:id", async (req, res) => {
  const storyId = parseInt(req.params.id, 10);
  if (!storyId || isNaN(storyId)) return res.status(400).json({ error: "Invalid story id" });

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT * FROM stories WHERE id = ?", [storyId]);
    if (!rows.length) return res.status(404).json({ error: "Story not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    conn.release();
  }
});

app.put("/api/stories/:id", async (req, res) => {
  const storyId = parseInt(req.params.id, 10);
  if (!storyId || isNaN(storyId)) return res.status(400).json({ error: "Invalid story id" });

  const allowed = ["story_url", "short_title", "article_title", "status"];
  const updates = {};
  for (const k of allowed) {
    if (k in req.body) updates[k] = req.body[k];
  }
  if (!Object.keys(updates).length) return res.status(400).json({ error: "No valid fields to update" });

  const fields = Object.keys(updates).map(k => `${k} = ?`).join(", ");
  const params = Object.keys(updates).map(k => updates[k]);
  params.push(storyId);

  const conn = await pool.getConnection();
  try {
    const [existing] = await conn.query("SELECT id FROM stories WHERE id = ?", [storyId]);
    if (!existing.length) return res.status(404).json({ error: "Story not found" });

    await conn.query(`UPDATE stories SET ${fields} WHERE id = ?`, params);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    conn.release();
  }
});

app.put("/api/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const {
    first_name,
    last_name,
    email,
    phone,
    bio,
    designation,
    job_type,
    reporting_manager_id,
    role_id,
    is_active,
  } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.query(
      `
      UPDATE users SET
        first_name = ?,
        last_name = ?,
        email = ?,
        phone = ?,
        bio = ?,
        designation = ?,
        job_type = ?,
        reporting_manager_id = ?,
        role_id = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        first_name || null,
        last_name || null,
        email || null,
        phone || null,
        bio || null,
        designation || null,
        job_type || null,
        reporting_manager_id || null,
        role_id,
        is_active ?? 1,
        userId,
      ]
    );

    res.json({ success: true });
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

  if (!Array.isArray(modules)) {
    return res.status(400).json({ error: "modules must be an array" });
  }

  const uniqueModules = [...new Set(modules)];
  for (const m of uniqueModules) {
    if (!ALLOWED_MODULES.includes(m)) {
      return res.status(400).json({ error: `Invalid module: ${m}` });
    }
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [existing] = await conn.query(
      "SELECT id FROM roles WHERE id = ?",
      [roleId]
    );
    if (existing.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Role not found" });
    }

    await conn.query(
      "UPDATE roles SET name = ? WHERE id = ?",
      [name.trim(), roleId]
    );

    await conn.query(
      "DELETE FROM role_permissions WHERE role_id = ?",
      [roleId]
    );

    if (uniqueModules.length > 0) {
      const values = uniqueModules.map(() => "(?, ?)").join(", ");
      const params = [];
      uniqueModules.forEach((m) => params.push(roleId, m));

      await conn.query(
        `INSERT INTO role_permissions (role_id, permission_key) VALUES ${values}`,
        params
      );
    }

    await conn.commit();

    res.json({
      id: roleId,
      name: name.trim(),
      modules: uniqueModules,
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    conn.release();
  }
});
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `
      SELECT u.id, u.username, u.password, r.name AS role
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.username = ?
      `,
      [username]
    );

    if (!rows.length || rows[0].password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: rows[0].id,
        username: rows[0].username,
        role: rows[0].role,
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
  .catch((err) => {
    console.error("Setup error:", err);
    process.exit(1);
  });
