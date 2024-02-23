const router = require('express').Router(),
    { totaltokens } = require('../Admingamecontroller/Token'),
    { protect } = require('../Middleware/index')

router
    .get("/totaltoken", protect, totaltokens)
module.exports = router;