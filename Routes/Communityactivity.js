const express = require("express");
const router = express.Router();
const Communityactivity = require('../Controllers/Communityactivity');
const { protect, gameprotect } = require("../Middleware/index")
router.get('/mcvalue', Communityactivity.mcvalue)
router.post("/resetmonthly", gameprotect, Communityactivity.resetmonthly)
router.get("/mcvaluemonthly", Communityactivity.mcvaluemonthly)
router.get("/find", Communityactivity.find)
module.exports = router