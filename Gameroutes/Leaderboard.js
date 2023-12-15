const router = require('express').Router(),
    { find } = require('../Gamecontrollers/Leaderboard')

router 
    .get('/find', find)

module.exports = router;