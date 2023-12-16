const express = require("express");
const router = express.Router();
const Wallet = require('../Controllers/Wallets');
const {  protect ,gameprotect } = require("../Middleware");

router.post('/createexisting', Wallet.createexsisting)
router.post("/sendcommission", gameprotect, Wallet.sendcommission)
router.post("/find", protect, Wallet.find)
module.exports = router;