const express = require("express");
const router = express.Router();
const Unilevel = require("../Controllers/Unilevel")
const { protect } = require("../Middleware/index")


router.get("/find", Unilevel.find)
router.post("/create", Unilevel.create)
module.exports = router;