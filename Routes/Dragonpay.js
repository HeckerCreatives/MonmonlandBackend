const express = require("express");
const router = express.Router();
const Dragonpay = require("../Controllers/Dragonpay")

router.post("/funds", Dragonpay.createfunds)
router.post("/bundles", Dragonpay.createbundles)
router.post("/verify", Dragonpay.verifypayments)
router.post("/createpayout", Dragonpay.createpayout)
router.get("/verifypayout", Dragonpay.verifypayout)
router.post("/subscribe", Dragonpay.subscribe)
router.post("/track", Dragonpay.track)
router.get("/dpstatus", Dragonpay.getdpstatus)
router.get("/dpchannel", Dragonpay.getavailabledpchannel)
module.exports = router