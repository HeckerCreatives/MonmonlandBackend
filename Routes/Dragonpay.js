const express = require("express");
const router = express.Router();
const Dragonpay = require("../Controllers/Dragonpay")

router.post("/funds", Dragonpay.create)

module.exports = router