const express = require("express");
const router = express.Router();
const Investorfund = require('../Controllers/Investorfunds');

router.post('/update', Investorfund.update)
router.get("/find", Investorfund.find)
router.get("/findhistory", Investorfund.findhistory)
module.exports = router