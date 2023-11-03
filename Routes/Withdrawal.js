const express = require("express");
const router = express.Router();
const Withdraw = require('../Controllers/Withdrawalfee');
const { gameprotect } = require("../Middleware");

router.post('/create',Withdraw.create)
router.post('/find', Withdraw.find)
router.post("/incwithdraw", gameprotect , Withdraw.incwithdrawalfee)
router.post("/decwithdraw", gameprotect , Withdraw.decwithdrawalfee)

module.exports = router;