const express = require("express");
const { getParticipantScoresAndFeedback } = require("../controllers/participantController");

const router = express.Router();
router.get("/:id/scores", getParticipantScoresAndFeedback);

module.exports = router;
