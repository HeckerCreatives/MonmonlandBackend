const router = require('express').Router(),
    { find, update } = require('../Gamecontrollers/Playerdetails'),
    { protectplayer } = require('../Gamemiddleware/index')
router 
    .post('/find', protectplayer, find)
    .post('/update', protectplayer, update)
    
module.exports = router;