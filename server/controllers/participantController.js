const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool();

exports.getParticipantScoresAndFeedback = async (req, res) => {
  const userId = req.params.id;

  try {
    // Fetch scores
    const scoreRes = await pool.query("SELECT * FROM scores WHERE user_id = $1", [userId]);
    const scores = scoreRes.rows[0];

    // Fetch latest feedback from logs (optional)
    const feedbackRes = await pool.query(
      "SELECT component, feedback, updated_at FROM score_change_logs WHERE user_id = $1 AND feedback IS NOT NULL ORDER BY updated_at DESC LIMIT 10",
      [userId]
    );

    res.status(200).json({
      scores,
      feedbacks: feedbackRes.rows,
    });
  } catch (err) {
    console.error("Error fetching participant data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
