const router = require('express').Router(),
    { register, changepassword, migrationdata, findreferrer, setreferrer, findnetwork, migrationreferrer, monmonseed, getgameannouncement, currentrank} = require('../Gamecontrollers/Gameusers'),
    { protectplayer } = require('../Gamemiddleware/index')

router 
    .post('/register', register)
    .post('/migrationdata', migrationdata)
    .post('/changepassword', protectplayer, changepassword)
    .get('/findreferrer/:id', findreferrer)
    .post('/setreferrer',  protectplayer, setreferrer)
    .get('/findnetwork', protectplayer, findnetwork)
    .get('/migrationreferrer/:username', migrationreferrer)
    .get('/monmonseed', monmonseed)
    .get('/gameannouncement', protectplayer, getgameannouncement)
    .get('/currentrank', protectplayer, currentrank)
module.exports = router;