const express = require("express");
const router = express.Router();
const UpgradeSubscription = require("../Controllers/UpgradeSubscription")


router.post("/add", UpgradeSubscription.add)
router.get("/find", UpgradeSubscription.getAll)
router.get('/findone/:id', UpgradeSubscription.getOneUser)
router.put("/update/:id", UpgradeSubscription.update)
router.delete("/:id/destroy", UpgradeSubscription.destroy);
router.delete("/destroymultiple", UpgradeSubscription.destroymultiple);



module.exports = router;