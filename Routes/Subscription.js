const express = require("express");
const router = express.Router();
const Subscription = require("../Controllers/Subscription")

// [without params]
router.post("/addsubscription", Subscription.addSubscription)
router.get("/find", Subscription.getAll)
router.get("/finddesc", Subscription.getAllDesc)
// router.post("/:id/save", Subscription.save)
// [with params]
router.put("/:id/update", Subscription.update)
router.put("/:id/updatedesc", Subscription.updateDesc)
router.post("/:id/addnewdesc", Subscription.addDescription)
router.get("/:id/find", Subscription.getOne)
router.get("/:id/finddesc", Subscription.getOneDes)
router.delete("/:id/destroy", Subscription.destroyDesc);





module.exports = router;