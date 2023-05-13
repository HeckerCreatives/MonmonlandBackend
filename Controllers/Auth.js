const GenerateToken = require('../Config/GenerateToken')
const User = require('../Models/Users')
const bcrypt = require('bcrypt')

module.exports.Login = (request, response) => {
    const {email, password} = request.body

    User.findOne({ $or: [{email}, {userName: email}]})
    .then(user => {
        console.log(user)
        if (user === null){
            return response.send(false)
        } else {
            const isPasswordCorrect = bcrypt.compareSync(password, user.password)

            if(isPasswordCorrect){
                return response.send(GenerateToken(user._id))
            } else {
                return response.send(false)
            }
        }
    })
    .catch(error => {
        return response.send(error)
    })
}