const express =  require("express")
const router = express.Router();
const Payout = require("../Controllers/Payout");
const { protect, gameprotect } = require("../Middleware/index");


router.post("/create", gameprotect ,Payout.create)
router.post("/adminfind",protect, Payout.adminfind)
router.post("/agentfind", protect,Payout.agentfind)
router.post("/process/:id", protect,Payout.process)
router.post("/done/:id", protect,Payout.done)
router.post("/reprocess/:id", protect,Payout.reprocess)
router.post("/reject/:id", protect,Payout.reject)
router.post("/payoutwallet", protect,Payout.findpayoutwallet)
router.post("/agentpayoutwallet", protect,Payout.agentpayoutwallet)
router.post("/createexisting", protect,Payout.createexsisting)
module.exports = router;