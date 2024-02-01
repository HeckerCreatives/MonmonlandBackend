const routers = app => {
    app.use('/members', require('./Members'))
    app.use('/reset', require('./Reset'))
}

module.exports = routers