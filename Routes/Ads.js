const express = require("express");
const router = express.Router();
const Ads = require('../Controllers/Ads');

router.post('/update', Ads.update)
router.get("/find", Ads.find)

module.exports = router