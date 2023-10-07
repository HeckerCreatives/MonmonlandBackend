const express = require("express");
const router = express.Router();
const Migrate = require('../Controllers/Migrate')

router.post('/seeddata', Migrate.migratedata)
router.post("/topupwallet", Migrate.topupwallet)
router.post("/payoutwallet", Migrate.payoutwallet)
router.post("/adminfeewallet", Migrate.adminfeewallet)
module.exports = router;