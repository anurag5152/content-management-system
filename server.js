require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

async function setupDatabase() {
  const conn = await pool.getConnection();

  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(150) UNIQUE,
        password VARCHAR(150),
        role_id INT,
        FOREIGN KEY(role_id) REFERENCES roles(id)
      )
    `);

    const [roleRows] = await conn.query(
      "SELECT id FROM roles WHERE name = 'admin'"
    );

    let adminRoleId;

    if (roleRows.length === 0) {
      const [result] = await conn.query(
        "INSERT INTO roles (name) VALUES ('admin')"
      );
      adminRoleId = result.insertId;
      console.log("Admin role created:", adminRoleId);
    } else {
      adminRoleId = roleRows[0].id;
    }

    const [userRows] = await conn.query(
      "SELECT id FROM users WHERE username = 'admin'"
    );

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
    app.listen(4000, () => {
      console.log("Server running on http://localhost:4000");
    });
  })
  .catch((err) => {
    console.error("Setup error:", err);
  });
