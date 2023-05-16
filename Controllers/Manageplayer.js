const User = require('../Models/Users');

module.exports.getActiveUser = (request, response) => {
    User.find({isActive: true})
    .then(data => response.send(data))
    .catch(error => response.send(error))
}

module.exports.getBanUser = (request, response) => {
    User.find({banned: true})
    .then(data => response.send(data))
    .catch(error => response.send(error))
}

module.exports.getEmailUserVerified = (request, response) => {
    User.find({isVerified: false})
    .then(data => response.send(data))
    .catch(error => response.send(error))
} 

module.exports.getWithBalanceUser = (request, response) => {
    User.find({balance: {$gt: 0}})
    .then(data => response.send(data))
    .catch(error => response.send(error))
} 

module.exports.getPaidUser = (request, response) => {
    User.find({banned: 0})
    .then(data => response.send(data))
    .catch(error => response.send(error))
}
  
module.exports.getAllUser = (request, response) => {
    User.find()
    .then(data =>{
    response.send(data)
    })
    .catch(error => response.send(error))
}

module.exports.getOneUser = async(request, response) => {
    await User.findById(request.params.id)
    .then(data => response.send(data))
    .catch(error => response.send(error))
}