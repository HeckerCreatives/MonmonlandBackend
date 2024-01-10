const routers = app => {
    app.use('/members', require('./Members'))
}

module.exports = routers