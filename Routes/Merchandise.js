const express = require("express");
const router = express.Router();
const Merchandise = require("../Controllers/Merchandise");
const {protect} = require("../Middleware/index")
router.post("/create", protect, Merchandise.create)
router.post("/update", protect, Merchandise.update )
router.post("/find",  Merchandise.find)



module.exports = router;