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
const Dailylimit = require('../Gamemodels/Dailylimit')
const Totalusers = require("../Models/Totalusers")
const Fiesta = require("../Gamemodels/Fiesta")
const Sponsor = require("../Gamemodels/Sponsor")
const Gameannouncement = require("../Gamemodels/Gameannouncement")
const Gameunlock = require("../Gamemodels/Gameunlock")
const Task = require("../Gamemodels/Task")
const mongoose = require("mongoose");
const moment = require('moment');
const bcrypt = require('bcrypt')
var playfab = require('playfab-sdk')
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
PlayFab.settings.titleId = process.env.monmontitleid;
const { Worker } = require('worker_threads')
const path = require('path')
const workerjs = path.resolve(__dirname, "../worker.js")
const encrypt = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

exports.getgameannouncement = (req, res) => {
    Gameannouncement.find()
    .sort({createdAt: -1})
    .then(data => {
        if (data.length <= 0){
            return res.json({message: "noannouncement"})
        }

        const finaldata = {
            title: data[0].title,
            description: data[0].description
        }
        
        return res.json({message: "success", data: finaldata})
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.monmonseed = (req, res) => {

    Gameusers.create({
        _id: '658be2287d0fa9e48a8512c5',
        username: 'monmonland',
        password: 'dev123',
        status: "active",
    }).then(data => {
        const gamewallet = [
            {
                owner: data._id,
                wallettype: "activitypoints",
                amount: 0,
                
            },  
            {
                owner: data._id,
                wallettype: "adspoints",
                amount: 0,
                

            },
            {
                owner: data._id,
                wallettype: "purchasepoints",
                amount: 0,
                

            },
            {
                owner: data._id,
                wallettype: "taskpoints",
                amount: 0,
                
            },
            {
                owner: data._id,
                wallettype: "directpoints", // group point na ituh
                amount: 0,
                
            },
            {
                owner: data._id,
                wallettype: "grouppoints",
                amount: 0,
                
            },
            {
                owner: data._id,
                wallettype: "totalpoints",
                amount: 0,
                
            },
            {
                owner: data._id,
                wallettype: "monstergemfarm",
                amount: 0,
                
            },
            {
                owner: data._id,
                wallettype: "monstergemunilevel",
                amount: 0,
                
            },
            {
                owner: data._id,
                wallettype: "monstercoin",
                amount: 0,
                
            },
            {
                owner: data._id,
                wallettype: "balance",
                amount: 0,
                
            },
            {
                owner: data._id,
                wallettype: "totalincome",
                amount: 0,
                
            },

        ]
        Gamewallet.create(gamewallet)
        .then(data => {
            res.json({message: 'success', data: 'Monmonseed'})
        })
        .catch(error => res.status(400).json({ message: "falied", data: error.message }));
    })
    .catch(error => res.status(400).json({ message: "falied", data: error.message }));
}

exports.register = async (req, res) => {
    const { username, password, referral, phone, email } = req.body

    const refer = await Gameusers.findOne({_id: referral})
    
    if(!refer){
        return res.json({message: "falied", data: "Please do not tamper the Url"})
    }

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
        .catch(error => {
            return res.json({message: "failed", data: error.message})
        })

        if(emailcheck){
            return res.json({message: "failed", data: "E-mail already exist"})
        }

        const isreferral = await Gameusers.findOne({_id: referral})
        .then(data => {
            if(data){
                return true
            } else {
                return false
            }
        })
        .catch(error => {
            return res.json({message: "failed", data: error.message})
        })

        if(!isreferral){
            return res.json({message: "failed", data: "Referral does not exist"})
        }

        const newuser = new Gameusers({
            username: username,
            password: password,
            referral: referral
        })

        let userid
    
        await newuser.save()
        .then(async data => {
            userid = data._id

            //task

            const task = [ 
                {
                    owner: userid,
                    type: "1",
                    value: "0"
                },
                {
                    owner: userid,
                    type: "2",
                    value: "0"
                },
                {
                    owner: userid,
                    type: "3",
                    value: "0"
                },
                {
                    owner: userid,
                    type: "4",
                    value: "0"
                },
                {
                    owner: userid,
                    type: "5",
                    value: "0"
                },
            ]

            await Task.create(task)

            //gameunlock

            // const gameunlock = [ 
            //     {
            //         owner: userid,
            //         type: "fiestagame",
            //         value: "0"
            //     },
            //     {
            //         owner: userid,
            //         type: "sponsorgame",
            //         value: "0"
            //     },
            // ]

            // await Gameunlock.create(gameunlock)

           // pooldetails
           const pooldetails = {
                owner: userid,
            }

        await Pooldetails.create(pooldetails)

        // gamewallet
        const gamewallet = [
            {
                owner: userid,
                wallettype: "activitypoints",
                amount: 0,
            },  
            {
                owner: userid,
                wallettype: "adspoints",
                amount: 0,
                

            },
            {
                owner: userid,
                wallettype: "purchasepoints",
                amount: 0,
                

            },
            {
                owner: userid,
                wallettype: "taskpoints",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "directpoints", // group point na ituh
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "grouppoints",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "totalpoints",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "monstergemfarm",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "monstergemunilevel",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "monstercoin",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "balance",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "totalincome",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "fiestaparticipation",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "sponsorparticipation",
                amount: 0,
                
            },
        ]

        await Gamewallet.insertMany(gamewallet)

                // walletcuoff

        const walletcutoff = [
            {
                owner: userid,
                wallettype: "activitypoints",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "adspoints",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "purchasepoints",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "taskpoints",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "directpoints",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "totalpoints",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "grouppoints",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "fiestaparticipation",
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: "sponsorparticipation",
                amount: 0,
                
            },

        ]

        await Walletscutoff.insertMany(walletcutoff)

                // equipment

        const equipment = [
            {
                owner: userid,
                type: "1",
                isowned: "1",
                expiration: 0,
                isequip: '1',
                
            },
            {
                owner: userid,
                type: "2",
                isowned: "0",
                expiration: 0,
                isequip: '0',
                
            },
            {
                owner: userid,
                type: "3",
                isowned: "0",
                expiration: 0,
                isequip: '0',
                
            },
            {
                owner: userid,
                type: "4",
                isowned: "0",
                expiration: 0,
                isequip: '0',
                
            },
            {
                owner: userid,
                type: "5",
                isowned: "0",
                expiration: 0,
                isequip: '0',
                
            },

        ]

        await Equipment.insertMany(equipment)

        // clock

        const clock = [
            {
                owner: userid,
                type: "1",
                isowned: "0",
                expiration: 0,
                isequip: '0',
                
            },
            {
                owner: userid,
                type: "2",
                isowned: "0",
                expiration: 0,
                isequip: '0',
                
            },
            {
                owner: userid,
                type: "3",
                isowned: "0",
                expiration: 0,
                isequip: '0',
                
            },
            {
                owner: userid,
                type: "4",
                isowned: "0",
                expiration: 0,
                isequip: '0',
                
            },

        ]

        await Clock.insertMany(clock)

                // games
        const games = [
            {
                owner: userid,
                type: "woodcutting",
                status: 'pending',
                unixtime: 0,
                harvestmc: 0,
                harvestmg: 0,
                harvestap: 0,
                timestarted: 0,
                
            },
            {
                owner: userid,
                type: "mining",
                status: 'pending',
                unixtime: 0,
                harvestmc: 0,
                harvestmg: 0,
                harvestap: 0,
                timestarted: 0,
                
            },
            {
                owner: userid,
                type: "fishing",
                status: 'pending',
                unixtime: 0,
                harvestmc: 0,
                harvestmg: 0,
                harvestap: 0,
                timestarted: 0,
                
            },
            {
                owner: userid,
                type: "farming",
                status: 'pending',
                unixtime: 0,
                harvestmc: 0,
                harvestmg: 0,
                harvestap: 0,
                timestarted: 0,
                
            },
            {
                owner: userid,
                type: "hunting",
                status: 'pending',
                unixtime: 0,
                harvestmc: 0,
                harvestmg: 0,
                harvestap: 0,
                timestarted: 0,
                
            },
            {
                owner: userid,
                type: "crafting",
                status: 'pending',
                unixtime: 0,
                harvestmc: 0,
                harvestmg: 0,
                harvestap: 0
            },
            {
                owner: userid,
                type: "smithing",
                status: 'pending',
                unixtime: 0,
                harvestmc: 0,
                harvestmg: 0,
                harvestap: 0,
                timestarted: 0,
                
            },

        ]

        await Ingamegames.insertMany(games)

        // energy
        const energy = {
                owner: userid,
                amount: 10,
                
        }
            
        await Energy.create(energy)

        // dailyactivities
        const dailyactivities = [
            {
                owner: userid,
                type: "1",
                status: 'not-claimed',
                taskpoints: 1,
                rewardsmc: 1,
                
            },
            {
                owner: userid,
                type: "2",
                status: 'not-claimed',
                taskpoints: 3,
                rewardsmc: 1,
                
            },
            {
                owner: userid,
                type: "3",
                status: 'not-claimed',
                taskpoints: 5,
                rewardsmc: 2,
                
            },
            {
                owner: userid,
                type: "4",
                status: 'not-claimed',
                taskpoints: 10,
                rewardsmc: 3,
                
            },
            {
                owner: userid,
                type: "5",
                status: 'not-claimed',
                taskpoints: 10,
                rewardsmc: 3,
                
            },

        ]

        await Dailyactivities.insertMany(dailyactivities)

        //playtimegrinding
        
        const playtimegrinding = [
            {
                owner: userid,
                type: "woodcutting",
                currenttime: 0,
                
            },
            {
                owner: userid,
                type: "mining",
                currenttime: 0,
                
            },
            {
                owner: userid,
                type: "fishing",
                currenttime: 0,
                
            },
            {
                owner: userid,
                type: "farming",
                currenttime: 0,
                
            },
            {
                owner: userid,
                type: "hunting",
                currenttime: 0,
                
            },
            {
                owner: userid,
                type: "crafting",
                currenttime: 0,
                
            },
            {
                owner: userid,
                type: "smithing",
                currenttime: 0,
                
            },


        ]

        await Playtimegrinding.insertMany(playtimegrinding)

        //leaderboard
        const leaderboard = {
            owner: userid,
            amount: 0,
            
        }

        await Ingameleaderboard.create(leaderboard)


        const dailylimit = [
            {
                owner: userid,
                wallettype: 'monstercoin',
                amount: 0,
                
            },
            {
                owner: userid,
                wallettype: 'monstergemfarm',
                amount: 0,
                
            },
        ]

        Dailylimit.insertMany(dailylimit)

        

        // playerdetails
        const playerdetails = {
            owner: userid,
            phone: phone,
            email: email,
            
        }

        await Playerdetails.create(playerdetails)

        await Totalusers.findByIdAndUpdate(process.env.totaluser, {$inc: {count: 1}})
        .then(() => {
            res.json({message: "success", data: "Registration Successfull"})
        })
        .catch(error => res.status(400).json({ error: error.message }))
        
    
            
        })
        .catch(async (error) => {

                if(userid == ''){
                res.status(500).json({message: 'failed'})
                return
                }

                await Playerdetails.deleteMany({owner: userid})
                await Gamewallet.deleteMany({owner: userid})
                await Walletscutoff.deleteMany({owner: userid})
                await Equipment.deleteMany({owner: userid})
                await Clock.deleteMany({owner: userid})
                await Ingamegames.deleteMany({owner: userid})
                await Dailyactivities.deleteMany({owner: userid})
                await Energy.deleteMany({owner: userid})
                await Playtimegrinding.deleteMany({owner: userid})
                await Ingameleaderboard.deleteMany({owner: userid})
                await Gameusers.deleteOne({_id: userid})
                await Dailylimit.deleteMany({_id: userid})
                res.status(500).json({ message: "failed",  data: error.message })
                return
        });
    })
    .catch(error => {
        return res.json({message: "failed", data: error.message})
    })
}

exports.changepassword = (req, res) => {
    const { password, oldpassword } = req.body

    Gameusers.findOne({username: req.user.username})
    .then(async user => {
        if(user && (await user.matchPassword(oldpassword))){
            if(user.status === "banned"){
                res.json({message: "failed", data: 'Your account has been banned'})
            } else {
                let newpassword = await encrypt(password)
                Gameusers.findByIdAndUpdate({_id: req.user.id}, {password: newpassword})
                .then(() => {
                    res.json({message: "success", data: "Password has been successfully change"})
                })
                .catch(error => res.status(400).json({ message: "falied", data: error.message }));
            }
        } else {
            res.json({message: "failed", data: "Password does not match"})
        }
    })
    .catch(error => res.status(400).json({ message: "falied", data: error.message }));
}

exports.migrationdata = (req, res) => {
    const { username, password , playfabToken, thetime, referral} = req.body

    const worker = new Worker(workerjs)

    worker.on('message', (result) => {
        res.json(result)
        worker.terminate();
    })

    worker.postMessage([username, password , playfabToken, thetime, referral])

}

exports.findreferrer = async (req, res) => {

    const { id } = req.params

    await Gameusers.findOne({ _id: id })
    .then(data => {
        if(data){
            res.json({message: "success", data: data.username})
        } else {
            res.json({message: "failed", data: 'Please do not tamper the url'})
        }
        
    })
    .catch(err => res.json({message: "failed", data: "Please do not tamper the url"}))
}

exports.setreferrer = async (req, res) => {
    const { referrer } = req.body

    const isexist = await Gameusers.findOne({username: referrer})

    if(!isexist){
        return res.json({message: "failed", data: "Sorry Referrer not found"})
    }

    await Gameusers.findOne({_id: req.user.id})
    .then(async data => {

        if(req.user.username === referrer){
            return res.json({message: "failed", data: "You cant set yourself as referrer"})
        }

        if(data.referral){
            return res.json({message: "failed", data: "You already set up your referrer"})
        }

        if(!data.referral){
            await Gameusers.findOneAndUpdate({_id: data._id},{referral: isexist._id})
            .then(item => {
                if(item){
                    res.json({message: "success", data: `You have successfully set up your referrer`})
                }
            })
            .catch(err => res.json({message: "failed", data: "Please try again later"}))
        }
    })
    .catch(err => res.json({message: "failed", data: "Please try again later"}))

}

exports.findnetwork = async (req, res) => {
    
    const downline = await Gameusers.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user.id),
            },
        },
        {
            $graphLookup: {
                from: "gameusers",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "referral",
                as: "ancestors",
                depthField: "level",
            },
        },
        {
            $unwind: "$ancestors",
        },
        {
            $replaceRoot: { newRoot: "$ancestors" },
        },
        {
            $addFields: {
                level: { $add: ["$level", 1] },
            },
        },
        {
            $lookup: {
                from: "pooldetails",
                localField: "_id", // Use the _id from ancestors
                foreignField: "owner",
                as: "subscriptionDetails",
            },
        },
        {
            $project: {
                _id: 0, // Exclude _id field
                username: 1,
                level: 1,
                subscription: { $arrayElemAt: ["$subscriptionDetails.subscription", 0] },
            },
        },
        {
            $group: {
                _id: "$level",
                data: { $push: "$$ROOT" },
            },
        },
        {
            $sort: { _id: 1 }, // Sort by level
        },
    ]);

    return res.json({message: 'success', data: downline});
};

exports.migrationreferrer = async (req, res) => {

    const { username } = req.params
    await Gameusers.findOne({ username: username })
    .then(data => {
        if(data){
            res.json({message: "success", data: data._id})
        } else {
            res.json({message: "failed", data: 'Referrer Not Found'})
        }
        
    })
    .catch(err => res.json({message: "failed", data: 'Referrer Not Found'}))
}

exports.currentrank = async (req, res) => {

    const playerlb = await Ingameleaderboard.findOne({owner: new mongoose.Types.ObjectId(req.user.id)})
    .then(data => data)
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))

    if (!playerlb){
        return res.status(404).json({ message: 'notfound' })
    }

    const rank = await Ingameleaderboard.countDocuments({amount: { $gte: playerlb.amount}})
    .then(data => data)
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))

    res.json({message: "success", data: rank})

}