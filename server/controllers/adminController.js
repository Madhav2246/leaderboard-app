const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = new Pool();

exports.getLeaderboard = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id AS user_id,
        u.name AS participant_name,
        u.email,
        m.id AS mentor_id,
        m.name AS mentor_name,
        s.challenge1_score,
        s.challenge2_score,
        s.challenge3_score,
        s.challenge4_score,
        s.consistency_score,
        s.communication_score,
        s.final_project_score,
        COALESCE(s.challenge1_score, 0) +
        COALESCE(s.challenge2_score, 0) +
        COALESCE(s.challenge3_score, 0) +
        COALESCE(s.challenge4_score, 0) +
        COALESCE(s.consistency_score, 0) +
        COALESCE(s.communication_score, 0) +
        COALESCE(s.final_project_score, 0) AS total_score
      FROM users u
      LEFT JOIN users m ON u.assigned_mentor_id = m.id
      LEFT JOIN scores s ON u.id = s.user_id
      WHERE u.role = 'participant'
      ORDER BY total_score DESC NULLS LAST
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getScoreChangeLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        scl.user_id,
        u.name AS participant_name,
        updater.name AS updated_by,
        scl.component,
        scl.old_value,
        scl.new_value,
        scl.feedback,
        scl.updated_at
      FROM score_change_logs scl
      LEFT JOIN users u ON scl.user_id = u.id
      LEFT JOIN users updater ON scl.updated_by = updater.id
      ORDER BY scl.updated_at DESC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createUserByAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!["mentor", "admin"].includes(role)) {
    return res.status(400).json({ error: "Role must be 'mentor' or 'admin'" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ user: result.rows[0], message: "User created by admin." });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user." });
  }
};

exports.getMentors = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM users WHERE role = 'mentor'");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching mentors:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.assignMentor = async (req, res) => {
  const { participantId, mentorId } = req.body;

  try {
    await pool.query(
      "UPDATE users SET assigned_mentor_id = $1 WHERE id = $2 AND role = 'participant'",
      [mentorId, participantId]
    );
    res.json({ success: true, message: "Mentor assigned successfully" });
  } catch (err) {
    console.error("Error assigning mentor:", err);
    res.status(500).json({ error: "Failed to assign mentor" });
  }
};
