const routers = app => {
    app.use('/members', require('./Members'))
    app.use('/reset', require('./Reset'))
    app.use('/token', require('./Token'))
}

module.exports = routers