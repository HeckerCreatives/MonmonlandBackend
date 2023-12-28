const router = require('express').Router(),
    { find } = require('../Gamecontrollers/Wallets'),
    { protectplayer } = require('../Gamemiddleware/index')
    
router 
    .get('/find', protectplayer, find)

module.exports = router;