const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const initDB = async () => {
  try {
    // === Create Tables ===
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS scores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        mentor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        challenge1_score INTEGER DEFAULT 0,
        challenge2_score INTEGER DEFAULT 0,
        challenge3_score INTEGER DEFAULT 0,
        challenge4_score INTEGER DEFAULT 0,
        consistency_score INTEGER DEFAULT 0,
        communication_score INTEGER DEFAULT 0,
        final_project_score INTEGER DEFAULT 0,
        total_score INTEGER GENERATED ALWAYS AS (
          challenge1_score +
          challenge2_score +
          challenge3_score +
          challenge4_score +
          consistency_score +
          communication_score +
          final_project_score
        ) STORED
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS score_change_logs (
        id SERIAL PRIMARY KEY,
        participant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        component VARCHAR(100) NOT NULL,
        old_value INTEGER,
        new_value INTEGER,
        updated_by VARCHAR(255) NOT NULL,
        feedback TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ All tables created or already exist.");

    // === Insert Initial Admin If Not Exists ===
    const adminEmail = "yalamarthi.sriram123@gmail.com";
    const checkAdmin = await pool.query("SELECT * FROM users WHERE email = $1", [adminEmail]);

    if (checkAdmin.rows.length === 0) {
      const hashed = await bcrypt.hash("Maddy@2246", 10);
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        ["Madhav", adminEmail, hashed, "admin"]
      );
      console.log("✅ Initial admin created.");
    } else {
      console.log("✅ Admin already exists.");
    }
  } catch (err) {
    console.error("❌ DB init error:", err);
  }
};

pool.connect()
  .then(async () => {
    console.log("✅ Connected to PostgreSQL");
    await initDB();
  })
  .catch((err) => console.error("❌ DB connection error", err));

app.get("/", (req, res) => {
  res.send("🚀 Server is running and connected to PostgreSQL!");
});

// === API Routes ===
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/score", require("./routes/scoreRoutes"));
app.use("/api/mentor", require("./routes/mentorRoutes"));
app.use("/api/participant", require("./routes/participantRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
