const express = require("express");
const router = express.Router();
const Wallet = require('../Controllers/Wallets');
const { gameprotect } = require("../Middleware");

router.post('/createexisting', Wallet.createexsisting)
router.post("/sendcommission", gameprotect, Wallet.sendcommission)
module.exports = router;