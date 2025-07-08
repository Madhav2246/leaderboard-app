const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool();

pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("DB connection error", err));

app.get("/", (req, res) => {
  res.send("Server is running and connected to PostgreSQL!");
});

const authRoutes = require("./routes/authRoutes");
const scoreRoutes = require("./routes/scoreRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const mentorRoutes = require("./routes/mentorRoutes");
app.use("/api/mentor", mentorRoutes);

const participantRoutes = require("./routes/participantRoutes");
app.use("/api/participant", participantRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const leaderboardRoutes = require("./routes/leaderboardRoutes");
app.use("/api/leaderboard", leaderboardRoutes);
