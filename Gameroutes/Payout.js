const router = require('express').Router(),
    { requestpayout } = require('../Gamecontrollers/Payout'),
    { protectplayer } = require('../Gamemiddleware/index')
    
router 
    .post('/requestpayout', protectplayer, requestpayout)

module.exports = router;