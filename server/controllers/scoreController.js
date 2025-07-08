const { Pool } = require("pg");
const pool = new Pool();

exports.updateScore = async (req, res) => {
  const {
    userId,
    challenge1_score,
    challenge2_score,
    challenge3_score,
    challenge4_score,
    consistency_score,
    communication_score,
    final_project_score,
    feedback
  } = req.body;

  const updaterId = req.user.id;

  try {
    // Fetch old scores
    const existing = await pool.query("SELECT * FROM scores WHERE user_id = $1", [userId]);

    if (existing.rows.length === 0) {
      await pool.query(
        `INSERT INTO scores (user_id, challenge1_score, challenge2_score, challenge3_score, challenge4_score,
          consistency_score, communication_score, final_project_score)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          userId,
          challenge1_score,
          challenge2_score,
          challenge3_score,
          challenge4_score,
          consistency_score,
          communication_score,
          final_project_score
        ]
      );
    } else {
      await pool.query(
        `UPDATE scores SET 
          challenge1_score = $1,
          challenge2_score = $2,
          challenge3_score = $3,
          challenge4_score = $4,
          consistency_score = $5,
          communication_score = $6,
          final_project_score = $7
         WHERE user_id = $8`,
        [
          challenge1_score,
          challenge2_score,
          challenge3_score,
          challenge4_score,
          consistency_score,
          communication_score,
          final_project_score,
          userId
        ]
      );
    }

    // Log changes to score_change_logs table
    const changes = {
      challenge1_score,
      challenge2_score,
      challenge3_score,
      challenge4_score,
      consistency_score,
      communication_score,
      final_project_score
    };

    const old = existing.rows[0] || {};
    for (const component in changes) {
      const oldValue = old[component] || 0;
      const newValue = parseInt(changes[component]);
      if (oldValue !== newValue) {
        await pool.query(
          `INSERT INTO score_change_logs (user_id, updated_by, component, old_value, new_value, feedback)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [userId, updaterId, component, oldValue, newValue, feedback || null]
        );
      }
    }

    res.json({ success: true, message: "Score updated successfully" });
  } catch (err) {
    console.error("Error updating score:", err);
    res.status(500).json({ error: "Failed to update score" });
  }
};
