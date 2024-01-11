const express = require("express");
const router = express.Router();
const Dragonpayout = require("../Controllers/Dragonpayout")

router.post("/process/:id", Dragonpayout.process)
router.post("/find", Dragonpayout.find)

module.exports = router