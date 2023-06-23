const express = require("express");
const router = express.Router();
const Games = require("../Controllers/Games");


router.post("/addgame", Games.create)
router.get("/find", Games.findall)
router.put("/:useId/update", Games.update)
router.get("/:userId/find", Games.find)










module.exports = router;