const router = require('express').Router(),
    { register, changepassword } = require('../Gamecontrollers/Gameusers')

router 
    .post('/register', register)
    .post('/changepassword', changepassword)

module.exports = router;