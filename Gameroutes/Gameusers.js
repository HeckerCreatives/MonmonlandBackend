const router = require('express').Router(),
    { register, changepassword, migrationdata, findreferrer, setreferrer } = require('../Gamecontrollers/Gameusers'),
    { protectplayer } = require('../Gamemiddleware/index')

router 
    .post('/register', register)
    .post('/migrationdata', migrationdata)
    .post('/changepassword', protectplayer, changepassword)
    .get('/findreferrer/:id', findreferrer)
    .post('/setreferrer',  protectplayer, setreferrer)
module.exports = router;