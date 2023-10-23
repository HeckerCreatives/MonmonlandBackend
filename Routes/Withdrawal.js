const express = require("express");
const router = express.Router();
const Withdraw = require('../Controllers/Withdrawalfee');
const { gameprotect } = require("../Middleware");

router.post('/create',Withdraw.create)
router.post('/find',Withdraw.find)
router.post("/incwithdraw", Withdraw.incwithdrawalfee)
router.post("/decwithdraw", Withdraw.decwithdrawalfee)

module.exports = router;