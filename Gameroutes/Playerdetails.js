const router = require('express').Router(),
    { find, update, findpooldetail } = require('../Gamecontrollers/Playerdetails'),
    { protectplayer } = require('../Gamemiddleware/index')
router 
    .post('/find', protectplayer, find)
    .post('/update', protectplayer, update)
    .get('/mysubs', protectplayer, findpooldetail)
module.exports = router;