const express = require("express");
const router = express.Router();
const Merchandise = require("../Controllers/Merchandise");
const { protect, gameprotect } = require("../Middleware/index")
router.post("/create", protect, Merchandise.create)
router.post("/update", protect, Merchandise.update )
router.post("/find",  Merchandise.find)
router.post("/updatemerchandise", gameprotect, Merchandise.merchandise)


module.exports = router;