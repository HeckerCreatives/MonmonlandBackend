const Gameusers = require("../Gamemodels/Gameusers")
const Playerdetails = require("../Gamemodels/Playerdetails")
const Pooldetails = require("../Gamemodels/Pooldetails")
const Walletscutoff = require('../Gamemodels/Walletscutoff')
const Gamewallet = require("../Gamemodels/Wallets")
const Equipment = require('../Gamemodels/Equipment')
const Clock  = require('../Gamemodels/Clock')
const Ingamegames = require('../Gamemodels/Games')
const Dailyactivities = require('../Gamemodels/Dailyactivities')
const Energy = require('../Gamemodels/Energy')
const Playtimegrinding = require('../Gamemodels/Playtimegrinding')
const Ingameleaderboard = require('../Gamemodels/Leaderboard')
const bcrypt = require('bcrypt')

const encrypt = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

exports.register = async (req, res) => {
    const { username, password, referral, phone, email } = req.body

    await Gameusers.findOne({username: username})
    .then(async data => {

        if(data){
          return res.json({message: "failed", data: "Username already exist"})
        }

        const emailcheck = await Playerdetails.findOne({email: email})
        .then(data => {
            if(data){
                return true
            }
        })

        if(emailcheck){
            return res.json({message: "failed", data: "E-mail already exist"})
        }

        const newuser = new Gameusers({
            username: username,
            password: password,
            referral: referral
        })
    
        await newuser.save()
        .then(async data => {
    
            // playerdetails
            const playerdetails = {
                owner: data._id,
                phone: phone,
                email: email
            }
    
            await Playerdetails.create(playerdetails)
    
            // pooldetails
            const pooldetails = {
                owner: data._id,
            }
    
            await Pooldetails.create(pooldetails)
    
            // walletcuoff
    
            const walletcutoff = [
                {
                    owner: data._id,
                    wallettype: "personalpoints"
                },
                {
                    owner: data._id,
                    wallettype: "adspoints"
                },
                {
                    owner: data._id,
                    wallettype: "purchasepoints"
                },
                {
                    owner: data._id,
                    wallettype: "taskpoints"
                },
                {
                    owner: data._id,
                    wallettype: "recruitpoints"
                },
                {
                    owner: data._id,
                    wallettype: "totalpoints"
                },
    
            ]
    
            await Walletscutoff.insertMany(walletcutoff)
    
            // gamewallet
    
            const gamewallet = [
                {
                    owner: data._id,
                    wallettype: "personalpoints"
                },
                {
                    owner: data._id,
                    wallettype: "adspoints"
                },
                {
                    owner: data._id,
                    wallettype: "purchasepoints"
                },
                {
                    owner: data._id,
                    wallettype: "taskpoints"
                },
                {
                    owner: data._id,
                    wallettype: "recruitpoints"
                },
                {
                    owner: data._id,
                    wallettype: "totalpoints"
                },
                {
                    owner: data._id,
                    wallettype: "monstergem"
                },
                {
                    owner: data._id,
                    wallettype: "monstercoin"
                },
                {
                    owner: data._id,
                    wallettype: "balance"
                },
                {
                    owner: data._id,
                    wallettype: "totalincome"
                },
    
            ]
    
            await Gamewallet.insertMany(gamewallet)
    
            // equipment
    
            const equipment = [
                {
                    owner: data._id,
                    type: "1",
                    isowned: "1",
                    expiration: '0',
                    isequip: '1'
                },
                {
                    owner: data._id,
                    type: "2",
                    isowned: "0",
                    expiration: '0',
                    isequip: '0'
                },
                {
                    owner: data._id,
                    type: "3",
                    isowned: "0",
                    expiration: '0',
                    isequip: '0'
                },
                {
                    owner: data._id,
                    type: "4",
                    isowned: "0",
                    expiration: '0',
                    isequip: '0'
                },
                {
                    owner: data._id,
                    type: "5",
                    isowned: "0",
                    expiration: '0',
                    isequip: '0'
                },
    
            ]
    
            await Equipment.insertMany(equipment)
    
            // clock
    
            const clock = [
                {
                    owner: data._id,
                    type: "1",
                    isowned: "0",
                    expiration: '0',
                    isequip: '0'
                },
                {
                    owner: data._id,
                    type: "2",
                    isowned: "0",
                    expiration: '0',
                    isequip: '0'
                },
                {
                    owner: data._id,
                    type: "3",
                    isowned: "0",
                    expiration: '0',
                    isequip: '0'
                },
                {
                    owner: data._id,
                    type: "4",
                    isowned: "0",
                    expiration: '0',
                    isequip: '0'
                },
    
            ]
    
            await Clock.insertMany(clock)
    
            // games
            const games = [
                {
                    owner: data._id,
                    type: "woodcutting",
                    status: 'pending',
                    unixtime: '0',
                    harvestmc: 0,
                    harvestmg: 0,
                    harvestap: 0
                },
                {
                    owner: data._id,
                    type: "mining",
                    status: 'pending',
                    unixtime: '0',
                    harvestmc: 0,
                    harvestmg: 0,
                    harvestap: 0
                },
                {
                    owner: data._id,
                    type: "fishing",
                    status: 'pending',
                    unixtime: '0',
                    harvestmc: 0,
                    harvestmg: 0,
                    harvestap: 0
                },
                {
                    owner: data._id,
                    type: "farming",
                    status: 'pending',
                    unixtime: '0',
                    harvestmc: 0,
                    harvestmg: 0,
                    harvestap: 0
                },
                {
                    owner: data._id,
                    type: "hunting",
                    status: 'pending',
                    unixtime: '0',
                    harvestmc: 0,
                    harvestmg: 0,
                    harvestap: 0
                },
                {
                    owner: data._id,
                    type: "crafting",
                    status: 'pending',
                    unixtime: '0',
                    harvestmc: 0,
                    harvestmg: 0,
                    harvestap: 0
                },
                {
                    owner: data._id,
                    type: "smithing",
                    status: 'pending',
                    unixtime: '0',
                    harvestmc: 0,
                    harvestmg: 0,
                    harvestap: 0
                },
    
            ]
    
            await Ingamegames.insertMany(games)
    
            // dailyactivities
            const dailyactivities = [
                {
                    owner: data._id,
                    type: "1",
                    status: 'not-claimed'
                },
                {
                    owner: data._id,
                    type: "2",
                    status: 'not-claimed'
                },
                {
                    owner: data._id,
                    type: "3",
                    status: 'not-claimed'
                },
                {
                    owner: data._id,
                    type: "4",
                    status: 'not-claimed'
                },
                {
                    owner: data._id,
                    type: "5",
                    status: 'not-claimed'
                },
    
            ]
    
            await Dailyactivities.create(dailyactivities)
    
            // energy
            const energy = {
                    owner: data._id,
                    amount: 0
            }
                
            await Energy.create(energy)
    
            //playtimegrinding
    
            const playtimegrinding = [
                {
                    owner: data._id,
                    type: "woodcutting",
                    day: 0, 
                    hours: 0, 
                    minute: 0, 
                    seconds: 0,
                },
                {
                    owner: data._id,
                    type: "mining",
                    day: 0, 
                    hours: 0, 
                    minute: 0, 
                    seconds: 0,
                },
                {
                    owner: data._id,
                    type: "fishing",
                    day: 0, 
                    hours: 0, 
                    minute: 0, 
                    seconds: 0,
                },
                {
                    owner: data._id,
                    type: "farming",
                    day: 0, 
                    hours: 0, 
                    minute: 0, 
                    seconds: 0,
                },
                {
                    owner: data._id,
                    type: "hunting",
                    day: 0, 
                    hours: 0, 
                    minute: 0, 
                    seconds: 0,
                },
                {
                    owner: data._id,
                    type: "crafting",
                    day: 0, 
                    hours: 0, 
                    minute: 0, 
                    seconds: 0,
                },
                {
                    owner: data._id,
                    type: "smithing",
                    day: 0, 
                    hours: 0, 
                    minute: 0, 
                    seconds: 0,
                },
    
    
            ]
    
            await Playtimegrinding.insertMany(playtimegrinding)
    
            const leaderboard = {
                owner: data._id,
                amount: 0,
            }
    
            await Ingameleaderboard.create(leaderboard)
    
            res.json({message: "success", data: "Registration Successfull"})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })

   
}

exports.changepassword = (req, res) => {
    const { username , password, oldpassword } = req.body

    Gameusers.findOne({username: username})
    .then(async user => {
        if(user && (await user.matchPassword(oldpassword))){
            if(user.status === "banned"){
                res.json({message: "failed", data: 'Your account has been banned'})
            } else {
                let newpassword = await encrypt(password)
                Gameusers.findByIdAndUpdate(user._id, {password: newpassword})
                .then(() => {
                    res.json({message: "success", data: "Password has been successfully change"})
                })
            }
        } else {
            res.json({message: "failed", data: "Password does not match"})
        }
    })
    .catch(error => res.status(400).json({ message: "falied", data: error.message }));
}