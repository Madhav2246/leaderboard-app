const express = require("express");
const router = express.Router();
const { getLeaderboard } = require("../controllers/leaderboardController");
const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, getLeaderboard);

module.exports = router;
