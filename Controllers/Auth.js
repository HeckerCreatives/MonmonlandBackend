const GenerateToken = require('../Config/GenerateToken');
const User = require('../Models/Users');
const bcrypt = require('bcrypt');
const fs = require('fs')
const path = require('path')
const privateKey = fs.readFileSync(path.resolve(__dirname, "../private-key.pem"), 'utf-8');
const jsonwebtokenPromisified = require('jsonwebtoken-promisified')

var expirationDate = new Date();
expirationDate.setTime(expirationDate.getTime() + 8 * 60 * 60 * 1000);

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

                let token = ''

                const payload = { _id: user._id, username: email, role: user.roleId, playfabid: user.playfabid }

                try {
                    token = await jsonwebtokenPromisified.sign(payload, privateKey, { algorithm: 'RS256' } )
                } catch (error) {
                    return response.status(500).json({error: error})
                }

                let userdata = await User.findByIdAndUpdate(
                    {_id: user._id},
                    {$set: {token: token}},
                    {new: true}
                )
                .select("-password -token")
                .populate({
                    path: "roleId",
                    select: "display_name"
                })
                response.cookie('sessionToken', token, { secure: true, sameSite: 'None' } ) // { httpOnly: true, expires: expirationDate }
                // response.cookie('auth', JSON.stringify(userdata), { httpOnly: true })
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

exports.logout = (req, res) => {
    res.clearCookie('sessionToken', { path: '/' });
    res.clearCookie('playfabAdminAuthToken', { path: '/' });
    res.redirect('/');
}

exports.islogin = (req, res) => {

    User.findOne({_id: req.user._id})
    .populate({
        path: "roleId",
        select: "display_name"
    })
    .then(data => {
        if(data){
            return res.json({id: req.user._id, role: data.roleId.display_name, name: req.user.username})
        }
    })
    .catch(error => {
        return res.send({ message: "failed", data: error})
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