const express = require("express");
const router = express.Router();
const Withdraw = require('../Controllers/Withdrawalfee');
const { gameprotect , protect} = require("../Middleware");

router.post('/create',Withdraw.create)
router.post('/find',protect, Withdraw.find)
router.post("/incwithdraw", gameprotect , Withdraw.incwithdrawalfee)
router.post("/decwithdraw", gameprotect , Withdraw.decwithdrawalfee)

module.exports = router;