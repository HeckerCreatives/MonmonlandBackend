const express = require("express");
const router = express.Router();
const Exchangerate = require('../Controllers/Exchangerate');
const { protect } = require("../Middleware");

router.post('/update', protect, Exchangerate.update)
router.get("/find", Exchangerate.find)
router.get("/findhistory", Exchangerate.findhistory)
module.exports = router