const express = require("express");
const router = express.Router();
const Totalusers = require("../Controllers/Totalusers")

router.post("/update", Totalusers.update)
router.get("/find", Totalusers.find)
module.exports = router;