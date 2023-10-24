const express = require("express");
const router = express.Router();
const SubscriptionUser = require("../Controllers/SubscriptionUser");
const { gameprotect } = require("../Middleware/index")
router.post("/create", gameprotect, SubscriptionUser.create)
router.post("/update", gameprotect, SubscriptionUser.update)
router.post("/find", SubscriptionUser.find)

module.exports = router;