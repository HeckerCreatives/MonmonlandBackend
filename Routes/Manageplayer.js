const express = require("express");
const router = express.Router();
const Manageplayer = require("../Controllers/Manageplayer")

router.get('/activeuser', Manageplayer.getActiveUser)
router.get('/banneduser', Manageplayer.getBanUser)
router.get('/alluser', Manageplayer.getAllUser)
router.get('/userunverified', Manageplayer.getEmailUserVerified)
router.get('/userwithbalance', Manageplayer.getWithBalanceUser)
router.get('/paiduser', Manageplayer.getPaidUser)
router.get('/oneuser/:id', Manageplayer.getOneUser)
router.put('/update/:id', Manageplayer.update)
router.put('/ban/:id', Manageplayer.ban)

module.exports = router
