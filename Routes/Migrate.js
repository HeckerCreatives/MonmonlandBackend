const express = require("express");
const router = express.Router();
const Migrate = require('../Controllers/Migrate')

router.post('/seeddata', Migrate.migratedata)


module.exports = router;