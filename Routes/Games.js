const express = require("express");
const router = express.Router();
const Games = require("../Controllers/Games");
const { protect } = require("../Middleware/index")

router.post("/addgame", protect,Games.create)
router.get("/find", Games.findall)
router.put("/:id/update", protect,Games.update)
router.get("/:id/findone", Games.find)
router.delete("/:id/destroy", protect, Games.destroy);









module.exports = router;