const express = require("express");
const router = express.Router();
const Communityactivity = require('../Controllers/Communityactivity');

router.post('/mcvalue', Communityactivity.mcvalue)

module.exports = router