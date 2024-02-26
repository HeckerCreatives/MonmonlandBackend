const router = require('express').Router(),
    { totaltokens, totaltokenpertype } = require('../Admingamecontroller/Token'),
    { protect } = require('../Middleware/index')

router
    .get("/totaltoken", protect, totaltokens)
    .get("/totaltokenpertype",  totaltokenpertype)
module.exports = router;