const router = require('express').Router(),
    { find, findwallethistory, findcashouthistory, paymentdetail , findpaymentdetail, subscommission, filterwallet, } = require('../Gamecontrollers/Wallets'),
    { protectplayer } = require('../Gamemiddleware/index')
    
router 
    .get('/find', protectplayer, find)
    .get('/findwallethistory', protectplayer, findwallethistory)
    .get('/findcashouthistory', protectplayer, findcashouthistory)
    // .get('/findcashouthistory1', protectplayer, findmanualcashouthistory)
    .post('/paymentdetail', protectplayer, paymentdetail)
    .get('/findpaymentdetail', protectplayer, findpaymentdetail)
    .get('/totalcommission', protectplayer, subscommission)
    .post('/filterwallet', protectplayer, filterwallet)
module.exports = router;