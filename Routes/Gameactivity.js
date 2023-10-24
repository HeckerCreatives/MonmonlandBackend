const express = require("express");
const router = express.Router();
const Gameactivity = require("../Controllers/Gameactivity");
const { protect } = require("../Middleware/index")

// [without params]
router.post("/addprogressbar", protect, Gameactivity.Progressbar);
router.get("/find", Gameactivity.getall)
router.get("/history", Gameactivity.gethistory)
router.get("/progress", Gameactivity.getprogress)

// [with params]
router.put("/:id/update", protect, Gameactivity.update)
router.get("/:id/find",  Gameactivity.getOne)

module.exports = router;