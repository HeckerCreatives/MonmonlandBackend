const express = require("express");
const router = express.Router();
const Migrate = require('../Controllers/Migrate')

router.post('/seeddata', Migrate.migratedata)
router.post("/topupwallet", Migrate.topupwallet)
router.post("/payoutwallet", Migrate.payoutwallet)
router.post("/adminfeewallet", Migrate.adminfeewallet)
router.post("/moncoin", Migrate.monmoncoin)
router.post("/totaluser", Migrate.totalusers)

module.exports = router;