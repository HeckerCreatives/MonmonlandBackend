const Gameusers = require("../Gamemodels/Gameusers")
const GenerateToken = require('../Config/GenerateToken');

exports.login = async ( req, res ) => {
    const { username, password} = req.body

    Gameusers.findOne({username: username})
    .then(async user => {
        if(user && (await user.matchPassword(password))){
            if(user.status === "banned"){
                res.json({message: "falied", data: "Account not found"})
            } else {
                let userdata = await Gameusers.findByIdAndUpdate(user._id, {$set: {token: GenerateToken(user._id)}}, { new: true })
                .select("-password")

                res.json({message: "success", data: userdata})
            }
        } else {
            res.json({message: "failed", data: "Username/Password does not match! Please try again."})
        }
    })
    .catch(error => {
        return res.json({ message: "failed", data: error.message})
    })
}