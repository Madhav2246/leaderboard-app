const express = require("express");
const router = express.Router();
const { updateScore } = require("../controllers/scoreController");
const authenticate = require("../middleware/authenticate");

router.post("/update", authenticate, updateScore);

module.exports = router;
