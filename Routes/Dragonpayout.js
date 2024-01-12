const express = require("express");
const router = express.Router();
const Dragonpayout = require("../Controllers/Dragonpayout")
const { protect } = require("../Middleware/index")
router.post("/process/:id", protect, Dragonpayout.process)
router.post("/reject/:id", protect, Dragonpayout.reject)
router.post("/find", protect, Dragonpayout.find)

module.exports = router