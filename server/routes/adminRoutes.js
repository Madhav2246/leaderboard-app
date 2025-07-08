const express = require("express");
const router = express.Router();
const {
  getLeaderboard,
  getScoreChangeLogs,
  createUserByAdmin,
  getMentors,
  assignMentor
} = require("../controllers/adminController");

const authenticate = require("../middleware/authenticate");
const requireAdmin = require("../middleware/requireAdmin");

router.get("/leaderboard", getLeaderboard);
router.get("/score-logs", getScoreChangeLogs);
router.get("/mentors", authenticate, requireAdmin, getMentors);
router.post("/create-user", authenticate, requireAdmin, createUserByAdmin);
router.post("/assign-mentor", authenticate, requireAdmin, assignMentor);

module.exports = router;
