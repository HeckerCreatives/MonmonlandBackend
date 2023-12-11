const express = require("express");
const router = express.Router();
const Trade = require("../Controllers/Trade")
const { protect } = require("../Middleware/index")

router.post("/updatetradepayin", protect, Trade.updatepayin)
router.post("/updatetrademerchindise", protect, Trade.updatemerchandise)
router.get("/findhistory", Trade.find)

module.exports = router;