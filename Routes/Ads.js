const express = require("express");
const router = express.Router();
const Ads = require('../Controllers/Ads');
const {protect} = require("../Middleware/index")
router.post('/update', protect, Ads.update)
router.get("/find", Ads.find)
router.get("/findhistory", Ads.findhistory)
module.exports = router