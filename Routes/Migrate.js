const express = require("express");
const router = express.Router();
const Migrate = require('../Controllers/Migrate')

router.post('/seeddata', Migrate.migratedata)

router.post("/topupwallet", Migrate.topupwallet)
router.post("/payoutwallet", Migrate.payoutwallet)
router.post("/adminfeewallet", Migrate.adminfeewallet)
router.post("/moncoin", Migrate.monmoncoin)
router.post("/totaluser", Migrate.totalusers)
router.post("/commiwallet", Migrate.admincommi)
router.post("/subs", Migrate.subs)
router.post("/withdraw", Migrate.withdrawfee)
router.post("/adsleaderboard", Migrate.adsandleaderboard)
router.post("/communityacivity", Migrate.communityactivity)
router.post("/communityactivityaccumulated", Migrate.communityactivityaccumulated)
router.post("/investorfund", Migrate.investorfund)
module.exports = router;