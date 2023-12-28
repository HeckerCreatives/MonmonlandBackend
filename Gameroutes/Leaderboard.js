const router = require('express').Router(),
    { find } = require('../Gamecontrollers/Leaderboard'),
    { protectplayer } = require('../Gamemiddleware/index')
    
router 
    .get('/find', protectplayer, find)

module.exports = router;