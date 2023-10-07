const express =  require("express")
const router = express.Router();
const Payout = require("../Controllers/Payout");
const { protect, gameprotect } = require("../Middleware");


router.post("/create", gameprotect ,Payout.create)
router.post("/adminfind", Payout.adminfind)
router.post("/agentfind", Payout.agentfind)
router.post("/process/:id", Payout.process)
router.post("/done/:id", Payout.done)
router.post("/reprocess/:id", Payout.reprocess)
router.post("/payoutwallet", Payout.findpayoutwallet)

module.exports = router;