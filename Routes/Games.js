const express = require("express");
const router = express.Router();
const Games = require("../Controllers/Games");


router.post("/addgame", Games.create)
router.get("/find", Games.findall)
router.put("/:id/update", Games.update)
router.get("/:id/findone", Games.find)










module.exports = router;