const express = require("express");
const router = express.Router();
const Nowpayment = require('../Nowpayment/nowpayment');

router.post('/funds', Nowpayment.createinvoicefunds)
// router.post("/bundles", Nowpayment.createinvoicebundles)
router.post("/verify", Nowpayment.verifypayments)
module.exports = router