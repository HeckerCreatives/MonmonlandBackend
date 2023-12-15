const router = require('express').Router(),
    { login } = require('../Gamecontrollers/Auth')

router 
    .post('/login', login)

module.exports = router;