const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const { getMentees } = require("../controllers/mentorController");

router.get("/mentees", authenticate, getMentees);

module.exports = router;
