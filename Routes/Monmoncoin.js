const express = require("express");
const router = express.Router();
const Monmoncoin = require("../Controllers/Monmoncoin")

router.post("/updatemc", Monmoncoin.updatemc)
router.post("/updatemg", Monmoncoin.updatemg)
router.post("/find", Monmoncoin.find)
module.exports = router;