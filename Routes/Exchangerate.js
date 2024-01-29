const express = require("express");
const router = express.Router();
const Exchangerate = require('../Controllers/Exchangerate');
const { protect } = require("../Middleware");

router.post('/update', protect, Exchangerate.update)
router.get("/find", Exchangerate.find)
router.get("/findpayoutrate", Exchangerate.findpayoutrate)
router.post("/findhistory", Exchangerate.findhistory)
router.post("/updatepayoutrate", protect, Exchangerate.updatepayoutrate)

module.exports = router