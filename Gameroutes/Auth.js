const router = require('express').Router(),
    { login, islogin, logout } = require('../Gamecontrollers/Auth'),
    { protectplayer } = require('../Gamemiddleware/index')

router 
    .post('/login', login)
    .get("/islogin", protectplayer, islogin)
    .get("/logout", logout)
module.exports = router;