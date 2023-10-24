const express = require("express");
const router = express.Router();
const Subscription = require("../Controllers/Subscription")
const { protect } = require("../Middleware/index")
// [without params]
router.post("/addsubscription", protect, Subscription.addSubscription)
router.get("/find", Subscription.getAll)
router.get("/finddesc", Subscription.getAllDesc)
// router.post("/:id/save", Subscription.save)
// [with params]
router.put("/:id/update", protect, Subscription.update)
router.put("/:id/updatedesc", protect, Subscription.updateDesc)
router.post("/:id/addnewdesc", protect, Subscription.addDescription)
router.get("/:id/find", Subscription.getOne)
router.get("/:id/finddesc", Subscription.getOneDes)
router.delete("/:id/destroy", protect, Subscription.destroyDesc);





module.exports = router;