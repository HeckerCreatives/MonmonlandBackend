const express = require("express");
const router = express.Router();
const UpgradeSubscription = require("../Controllers/UpgradeSubscription")


router.post("/add", UpgradeSubscription.add)
router.post("/addbuyer", UpgradeSubscription.addbuyer)
router.get("/find", UpgradeSubscription.getAll)
router.get("/findbuyer", UpgradeSubscription.getAllbuyer)
router.get('/findone/:id', UpgradeSubscription.getOneUser)
router.put("/update/:id", UpgradeSubscription.update)
router.put("/updatebuyer/:id", UpgradeSubscription.updatebuyer)
router.delete("/:id/destroy", UpgradeSubscription.destroy);
router.delete("/:id/destroybuyer", UpgradeSubscription.destroybuyer);
router.delete("/destroymultiple", UpgradeSubscription.destroymultiple);
router.post('/filterpayment', UpgradeSubscription.paymentfilter);
router.post('/searchcashier', UpgradeSubscription.searchcashier);
router.post('/autoreceipt', UpgradeSubscription.findcoinbasereceipt);

module.exports = router;