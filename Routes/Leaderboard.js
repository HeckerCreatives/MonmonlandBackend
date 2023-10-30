const express = require("express");
const router = express.Router();
const Leaderboard = require('../Controllers/Leaderboard');

router.post('/update', Leaderboard.update)
router.get("/find", Leaderboard.find)

module.exports = router