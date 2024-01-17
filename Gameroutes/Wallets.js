const router = require('express').Router(),
    { find, findwallethistory, findcashouthistory, paymentdetail , findpaymentdetail, subscommission} = require('../Gamecontrollers/Wallets'),
    { protectplayer } = require('../Gamemiddleware/index')
    
router 
    .get('/find', protectplayer, find)
    .get('/findwallethistory', protectplayer, findwallethistory)
    .get('/findcashouthistory', protectplayer, findcashouthistory)
    .post('/paymentdetail', protectplayer, paymentdetail)
    .get('/findpaymentdetail', protectplayer, findpaymentdetail)
    .get('/totalcommission', protectplayer, subscommission)
module.exports = router;