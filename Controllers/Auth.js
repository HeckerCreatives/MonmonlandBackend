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
    .then(async user => {
        if(user && (await user.matchPassword(password))){
            if (!user){
                return response.send({ message: "failed", data: "Account Not Found"})
            } else {
                let userdata = await User.findByIdAndUpdate(
                    {_id: user._id},
                    {$set: {token: GenerateToken(user._id)}},
                    {new: true}
                )
                .select("-password")
                .populate({
                    path: "roleId",
                    select: "display_name"
                })
                
                return response.json({message: "success", data: userdata})
                
            }
        } else {
            return response.json({ message: "failed", data: "Username/Password does not match! Please try again."})
        }
        
    })
    .catch(error => {
        return response.send({ message: "failed", data: error})
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