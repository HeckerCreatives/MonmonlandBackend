
const router = require('express').Router(),
    { find, searchByEmail, searchByUsername, findByUsername, changepassmember, updatememberdetail, memberwallethistory, joined, banmember, banmultiplemember, unbanmember, unbanmultiplemember, memberbannedlist, bannedcount, filterwallet, findtopearners, findnetwork, fiesta, sponsor, getmembertools, getmemberclock, getmembercosmetics, getmemberpaydetail, paymentdetail, getmembersupplies, getmembertask, gameannouncement, maintenance, maintenancevalue, getcurrentrank, grantenergy, grantclock, granttool, grantcosmetic, grantbalance, grantmonstercoin, grantmonstergem, createsponsorprize, findsponsorprize, sponsorprizeonandoff, sponsorprizedelete, editsponsorprize, getgrindinghistory, gettransactionhistory, filtertransaction, filtergrinding, searchBySubscription, searchByWallet, getpayables, getpayableshistory, makeplayeractive, grantmct, grantmmt } = require('../Admingamecontroller/Members'),
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
    .post('/gamemaintenance', protect, maintenance)
    .get('/gamemaintenancevalue', protect, maintenancevalue)
    .post('/getcurrentrank', protect, getcurrentrank)
    .post('/grantenergy', protect, grantenergy)
    .post('/granttool', protect, granttool)
    .post('/grantclock', protect, grantclock)
    .post('/grantcosmetic', protect, grantcosmetic)
    .post('/grantbalance', protect, grantbalance)
    .post('/grantmonstercoin', protect, grantmonstercoin)
    .post('/grantmonstergem', protect, grantmonstergem)
    .post('/createsponsorprize', protect, createsponsorprize)
    .get('/findsponsorprize', protect, findsponsorprize)
    .post('/sponsorprizeonandoff/:id', protect, sponsorprizeonandoff)
    .post('/sponsorprizedelete/:id', protect, sponsorprizedelete)
    .post('/editsponsorprize/:id', protect, editsponsorprize)
    .post('/gettransactionhistory', protect, gettransactionhistory)
    .post('/getgrindinghistory', protect, getgrindinghistory)
    .post('/filtertransaction', protect, filtertransaction)
    .post('/filtergrinding', protect, filtergrinding)
    .post('/filterbysubscription', protect, searchBySubscription)
    .post('/filterbywallet', protect, searchByWallet)
    .post('/getpayables', protect, getpayables)
    .get('/getpayableshistory', protect, getpayableshistory)
    .post('/makeactive', protect, makeplayeractive)
    .post('/grantmmt', protect, grantmmt)
    .post("/grantmct", protect, grantmct)
    
module.exports = router;