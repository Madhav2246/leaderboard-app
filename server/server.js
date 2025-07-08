const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use proper config for PostgreSQL on Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Render-hosted DB
  },
});

// DB connection test
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ DB connection error", err));

app.get("/", (req, res) => {
  res.send("🚀 Server is running and connected to PostgreSQL!");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/score", require("./routes/scoreRoutes"));
app.use("/api/mentor", require("./routes/mentorRoutes"));
app.use("/api/participant", require("./routes/participantRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
