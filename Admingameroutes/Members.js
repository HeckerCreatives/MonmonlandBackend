
const router = require('express').Router(),
    { find, searchByEmail, searchByUsername, findByUsername, changepassmember, updatememberdetail, memberwallethistory, joined, banmember, banmultiplemember, unbanmember, unbanmultiplemember, memberbannedlist, bannedcount, filterwallet, findtopearners, findnetwork, fiesta, sponsor, getmembertools, getmemberclock, getmembercosmetics, getmemberpaydetail, paymentdetail, getmembersupplies, getmembertask, gameannouncement } = require('../Admingamecontroller/Members'),
    { protect } = require('../Middleware/index')

router 
    .get('/find', protect, find)
    .post('/searchusername', protect, searchByUsername)
    .post('/searchemail', protect, searchByEmail)
    .post('/findprofile', protect, findByUsername)
    .post('/changepassmember', protect, changepassmember)
    .post('/updatememberdetail', protect, updatememberdetail)
    .post('/memberwallethistory', protect, memberwallethistory)
    .get('/joined', protect, joined)
    .post('/banmember', protect, banmember)
    .post('/unbanmember', protect, unbanmember)
    .post('/banmultiplemember', protect, banmultiplemember)
    .post('/unbanmultiplemember', protect, unbanmultiplemember)
    .get('/bannedmembers', protect, memberbannedlist)
    .get('/bannedcount', protect, bannedcount)
    .post('/filterwallet', protect, filterwallet)
    .get('/topearners', protect, findtopearners)
    .post('/findnetwork', protect, findnetwork)
    .post('/fiesta', protect, fiesta)
    .post('/sponsor', protect, sponsor)
    .post('/getmembertools', protect, getmembertools)
    .post('/getmemberclock', protect, getmemberclock)
    .post('/getmembercosmetics', protect, getmembercosmetics)
    .post('/getmemberpaydetail', protect, getmemberpaydetail)
    .post('/updatepaymentdetail', protect, paymentdetail)
    .post('/getmembersupplies', protect, getmembersupplies)
    .post('/getmembertask', protect, getmembertask)
    .post('/gameannouncement', protect, gameannouncement)
module.exports = router;