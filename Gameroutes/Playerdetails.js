const router = require('express').Router(),
    { find, update } = require('../Gamecontrollers/Playerdetails')

router 
    .post('/find', find)
    .post('/update', update)
    
module.exports = router;