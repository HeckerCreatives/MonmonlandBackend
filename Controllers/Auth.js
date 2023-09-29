const GenerateToken = require('../Config/GenerateToken');
const User = require('../Models/Users');
const bcrypt = require('bcrypt');

module.exports.Login = (request, response) => {
    const {email, password} = request.body

    User.findOne({ $or: [{email}, {userName: email}]})
    .populate({
        path: "roleId",
        select: "display_name"
    })
    .then(user => {
        if (!user){
            return response.send(false)
        } else {
            const isPasswordCorrect = bcrypt.compareSync(password, user.password)

            if(isPasswordCorrect){
                user.token = GenerateToken(user._id)
                return response.json(user)
            } else {
                return response.send(false)
            }
        }
    })
    .catch(error => {
        return response.send(error)
    })
}

exports.gentoken = (req, res) => {
    try {
        const token = GenerateToken();
        res.json(token)
    } catch (error) {
        res.json({error: error.message})
    }
}