const router = require('express').Router(),
    { find } = require('../Gamecontrollers/Wallets')

router 
    .post('/find', find)

module.exports = router;