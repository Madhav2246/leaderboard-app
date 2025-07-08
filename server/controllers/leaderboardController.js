const { Pool } = require("pg");
const pool = new Pool();

exports.getLeaderboard = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id AS user_id,
        u.name AS participant_name,
        u.email,
        m.name AS mentor_name,
        m.id AS mentor_id,
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

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
