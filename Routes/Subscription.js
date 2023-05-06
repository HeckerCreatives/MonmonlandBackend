const express = require("express");
const router = express.Router();
const Subscription = require("../Controllers/Subscription")

// [without params]
router.post("/addsubscription", Subscription.addSubscription)
router.get("/find", Subscription.getAll)
// router.post("/:id/save", Subscription.save)
// [with params]
router.put("/:id/update", Subscription.update)
router.get("/:id/find", Subscription.getOne)






module.exports = router;