
const routers = app => {
    app.use('/gameusers', require('./Gameusers'))
    app.use('/gamewallet', require('./Wallets'))
    app.use('/ingameleaderboard', require('./Leaderboard'))
    app.use('/playerdetails', require('./Playerdetails'))
    app.use('/gameauth', require('./Auth'))
}

module.exports = routers