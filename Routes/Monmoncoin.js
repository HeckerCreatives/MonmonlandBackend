const express = require("express");
const router = express.Router();
const Monmoncoin = require("../Controllers/Monmoncoin")
const { gameprotect } = require("../Middleware/index")
router.post("/updatemc", gameprotect, Monmoncoin.updatemc)
router.post("/updatemg", gameprotect, Monmoncoin.updatemg)
router.post("/find", Monmoncoin.find)
module.exports = router;