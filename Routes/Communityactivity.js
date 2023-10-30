const express = require("express");
const router = express.Router();
const Communityactivity = require('../Controllers/Communityactivity');

router.get('/mcvalue', Communityactivity.mcvalue)

module.exports = router