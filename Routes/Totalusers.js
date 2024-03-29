const express = require("express");
const router = express.Router();
const Totalusers = require("../Controllers/Totalusers")
const { gameprotect } = require("../Middleware/index")
router.post("/update", gameprotect, Totalusers.update)
router.get("/find", Totalusers.find)
router.get("/subscriptionusers", Totalusers.subscriptionusers)
module.exports = router;