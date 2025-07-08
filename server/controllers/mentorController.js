const { Pool } = require("pg");
const pool = new Pool();

exports.getMentees = async (req, res) => {
  const mentorId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT 
         u.id AS user_id, u.name, u.email,
         s.challenge1_score, s.challenge2_score, s.challenge3_score, s.challenge4_score,
         s.consistency_score, s.communication_score, s.final_project_score
       FROM users u
       LEFT JOIN scores s ON u.id = s.user_id
       WHERE u.assigned_mentor_id = $1 AND u.role = 'participant'`,
      [mentorId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching mentees:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
