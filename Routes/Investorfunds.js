const express = require("express");
const router = express.Router();
const Investorfund = require('../Controllers/Investorfunds');
const { protect } = require("../Middleware/index")
router.post('/update', protect,Investorfund.update)
router.get("/find", Investorfund.find)
router.get("/findhistory", Investorfund.findhistory)
module.exports = router 