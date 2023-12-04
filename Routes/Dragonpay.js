const express = require("express");
const router = express.Router();
const Dragonpay = require("../Controllers/Dragonpay")

router.post("/funds", Dragonpay.createfunds)
router.post("/bundles", Dragonpay.createbundles)
router.post("/verify", Dragonpay.verifypayments)
router.post("/createpayout", Dragonpay.createpayout)
router.get("/verifypayout", Dragonpay.verifypayout)
module.exports = router