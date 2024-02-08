const Gameusers = require("../Gamemodels/Gameusers")
const User = require("../Models/Users")
const Playerdetails = require("../Gamemodels/Playerdetails")
const fs = require('fs')
const path = require('path')
const privateKey = fs.readFileSync(path.resolve(__dirname, "../private-key.pem"), 'utf-8');
const jsonwebtokenPromisified = require('jsonwebtoken-promisified')
const bcrypt = require('bcrypt')

const encrypt = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

exports.login = async ( req, res ) => {
    const { username, password} = req.body
    if(username == "masteradmin"){
    User.findOne({userName: username})
    .populate({
        path: "roleId",
        select: "display_name"
    })
    .then(async user => {
        if(user && (await user.matchPassword(password))){
            if (!user){
                return res.send({ message: "failed", data: "Account Not Found"})
            } else {

                let token = ''

                const payload = { _id: user._id, username: username, role: user.roleId, playfabid: user.playfabid }

                try {
                    token = await jsonwebtokenPromisified.sign(payload, privateKey, { algorithm: 'RS256' } )
                } catch (error) {
                    return res.status(500).json({error: error})
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
                res.cookie('sessionToken', token, { secure: true, sameSite: 'None' } ) // { httpOnly: true, expires: expirationDate }
                // res.cookie('auth', JSON.stringify(userdata), { httpOnly: true })
                return res.json({message: "adminsuccess", data: userdata})
                
            }
        } else {
            return res.json({ message: "failed", data: "Username/Password does not match! Please try again."})
        }
        
    })
    .catch(error => {
        return res.send({ message: "failed", data: error})
    })
    } else {
        Gameusers.findOne({username: username})
        .then(async user => {
            if(user && (await user.matchPassword(password))){
                if(user.status === "banned"){
                    res.json({message: "failed", data: "Account is banned. please contact and admin"})
                } else {
                    const token = await encrypt(privateKey)
    
                    await Gameusers.findByIdAndUpdate(user._id, {$set: { webtoken: token }})
                    .select("-password")
                    .then(async () => {
                        const paylaod = {id: user._id, username: user.username, status: user.status, token: token}
                        let jwttoken = ""
    
                        try {
                            jwttoken = await jsonwebtokenPromisified.sign(paylaod, privateKey, {algorithm: 'RS256'})
                        } catch (error) {
                            console.error('Error signing token')
                            return res.status(500).json({error: 'Internal server error'})
                        }
    
                        const data = {
                            token: token
                        }
    
                        res.cookie('sessionToken', jwttoken,{ secure: true, sameSite: 'None' })
                        res.json({message: "success", data: data})
                    })
                    .catch(error => {
                        return res.json({ message: "failed", data: error.message})
                    })
                    
                }
            } else {
                res.json({message: "failed", data: "Username/Password does not match! Please try again."})
            }
        })
        .catch(error => {
            return res.json({ message: "failed", data: error.message})
        })
    }
    
}

exports.islogin = async (req, res) => {

    Gameusers.findOne({_id: req.user.id})
    .select("-password")
    .then(async data => {
        if(data){
            const email = await Playerdetails.findOne({owner: req.user.id})
            .then(detail => {
                return detail.email
            })
            return res.json({ name: data.username, referrer: data.referral, email: email, uid: data._id, joined: data.createdAt})
        }
    })
    .catch(error => {
        return res.json({ message: "failed", data: error.message})
    })
}

exports.logout = (req, res) => {
    res.clearCookie('sessionToken', { secure: true, sameSite: 'None' });
    res.redirect('/gamelogin');
}