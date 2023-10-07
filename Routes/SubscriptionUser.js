const express = require("express");
const router = express.Router();
const SubscriptionUser = require("../Controllers/SubscriptionUser");

router.post("/create", SubscriptionUser.create)
router.post("/update", SubscriptionUser.update )
router.post("/find", SubscriptionUser.find)



module.exports = router;