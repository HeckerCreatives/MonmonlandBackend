const User = require('../Models/Users')
const bcrypt = require('bcrypt')

module.exports.userRegister = async (request, response) => {
    const {firstName,lastName,userName,email,password, roleId} = request.body

    try{
        await User.findOne({email: email})
        .then(result => {
            if(result !== null){
                response.send(false)
            } else {
            // Create user
            const newUser = new User({
                roleId: roleId,
                firstName: firstName,
                lastName: lastName,
                userName: userName,
                email:email,
                password: bcrypt.hashSync(password, 10)
            })
            // Save new user
            newUser.save()
            .then(save => {
            return response.send(save)
            })
            
            }
        })
        
    }
    catch (error){
        return response.send(error)
    }
}

module.exports.update = (request, response) => {
    User.findByIdAndUpdate(request.params.id, request.body, {new: true})
    .then(data => response.json(data))
    .catch(error => response.status(400).json({error: error.message}))
  }
  
module.exports.getOne = (request, response) => {
    User.findById(request.params.id)
    .then(data => response.send(data))
    .catch(error => response.send(error))
}  
  
module.exports.getAll = (request, response) => {
    User.find()
    .then(data =>{
    response.send(data)
    })
    .catch(error => response.send(error))
}