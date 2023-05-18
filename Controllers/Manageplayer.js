const { response } = require('express');
const User = require('../Models/Users');

module.exports.getActiveUser = (request, response) => {
    User.find({isActive: true, banned: false})
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

module.exports.update = (request, response) => {
    User.findByIdAndUpdate(request.params.id, request.body, {new: true})
    .then(data => response.json(data))
    .catch(error => response.status(400).json({error: error.message}))
}

module.exports.ban = (request, response) => {
    let isBan = request.body
    User.findByIdAndUpdate(request.params.id, {
        banned: isBan.banned}, {new: true})
    .then(()=> response.json(`${request.params.id} banned successfully`))
    .catch(error => response.status(400).json({ error: error.message }));
}