const Gameusers = require('../Gamemodels/Gameusers')
const Playerdetails = require('../Gamemodels/Playerdetails')
const Wallets = require('../Gamemodels/Wallets')
const Communityactivity = require("../Models/Communityactivity")
const Monmoncoin = require("../Models/Monmoncoin")
const Gameactivity = require("../Models/Gameactivity")
const Ads = require("../Models/Ads")
const Investorfunds = require("../Models/Investorfunds")
const Wallethistory = require('../Gamemodels/Wallethistory')
const Pooldetails = require('../Gamemodels/Pooldetails')
const moment = require('moment-timezone');
const Ingameleaderboard = require("../Gamemodels/Leaderboard")
const Fiesta = require("../Gamemodels/Fiesta")
const Sponsor = require("../Gamemodels/Sponsor")
const mongoose = require("mongoose");
const Equipment = require("../Gamemodels/Equipment")
const Clock = require('../Gamemodels/Clock')
const Cosmetics = require("../Gamemodels/Cosmetics")
const WalletsCutoff = require('../Gamemodels/Walletscutoff')
const Paymentdetails = require("../Gamemodels/Paymentdetails")
const DragonPaymentdetails = require('../Models/Paymentdetails')
const Energyinventories = require('../Gamemodels/Energyinventories')
const Gameannouncement = require("../Gamemodels/Gameannouncement")
const Maintenance = require("../Gamemodels/Maintenance")
const encrypt = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

exports.find = (req, res) => {

    Gameusers.aggregate([
        {
            $lookup: {
                from: "playerdetails",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$owner", "$$userId"] }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            owner: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                            // Add other fields to exclude as needed
                        }
                    }
                ],
                as: "playerDetails"
            }
        },
        {
            $unwind: "$playerDetails" // Unwind the playerDetails array
        },
        {
            $lookup: {
                from: "gameusers",
                localField: "referral",
                foreignField: "_id",
                as: "referralUser"
            }
        },
        {
            $project: {
                _id: 0,
                username: 1,
                status: 1,
                referral: { $arrayElemAt: ["$referralUser.username", 0] },
                createdAt: 1,
                phone: "$playerDetails.phone",
                email: "$playerDetails.email"
            }
        },
        {
            $match: {
                status: "active",
                username: { $ne: "monmonland" }
            }
        }
    ])
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch(err => {
        res.json({message: "failed", data: err})
    })
}

exports.searchByUsername = async (req, res) => {
    const { username } = req.body

    const usernameRegex = new RegExp(`^${username}`, 'i');
    
    await Gameusers.aggregate([
        {
            $lookup: {
                from: "playerdetails",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$owner", "$$userId"] }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            owner: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                            // Add other fields to exclude as needed
                        }
                    }
                ],
                as: "playerDetails"
            }
        },
        {
            $unwind: "$playerDetails" // Unwind the playerDetails array
        },
        {
            $lookup: {
                from: "gameusers",
                localField: "referral",
                foreignField: "_id",
                as: "referralUser"
            }
        },
        {
            $project: {
                _id: 0,
                username: 1,
                status: 1,
                referral: { $arrayElemAt: ["$referralUser.username", 0] },
                createdAt: 1,
                phone: "$playerDetails.phone",
                email: "$playerDetails.email"
            }
        },
        {
            $match: {
                status: "active",
                username: { $regex: usernameRegex }
            }
        }
    ])
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch(err => {
        res.json({message: "failed", data: err})
    })
}

exports.searchByEmail = (req, res) => {
    const { email } = req.body;

    // Create a regular expression for case-insensitive prefix search
    const emailRegex = new RegExp(`^${email}`, 'i');
    console.log(email)
    Gameusers.aggregate([
        {
            $lookup: {
                from: "playerdetails",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$owner", "$$userId"] }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            owner: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                            // Add other fields to exclude as needed
                        }
                    }
                ],
                as: "playerDetails"
            }
        },
        {
            $unwind: "$playerDetails" // Unwind the playerDetails array
        },
        {
            $lookup: {
                from: "gameusers",
                localField: "referral",
                foreignField: "_id",
                as: "referralUser"
            }
        },
        {
            $project: {
                _id: 0,
                username: 1,
                status: 1,
                referral: { $arrayElemAt: ["$referralUser.username", 0] },
                createdAt: 1,
                phone: "$playerDetails.phone",
                email: "$playerDetails.email"
            }
        },
        {
            $match: {
                status: "active",
                email: { $regex: emailRegex }
            }
        }
    ])
    .then(data => {
        res.json({ message: "success", data: data });
    })
    .catch(err => {
        res.json({ message: "failed", data: err });
    });
};

exports.findByUsername = (req, res) => {
    const {username} = req.body;

    Gameusers.findOne({username: username})
    .then(user => {
        Wallets.find({owner: user._id})
        .then(async data => {

            const playerdetails = await Playerdetails.findOne({owner: user._id})
            .then(data => {
                return data
            })

            const pooldetail = await Pooldetails.findOne({owner: user._id})
            .select('status rank subscription')
            .then(pool => {
                return pool
            })
            .catch(error => res.status(500).json({ message: "failed", data: error.message }));
    
            const mcvalue = await Monmoncoin.findOne({ name: "Monster Coin" })
            .then(async mc => {
                const ads = await Ads.findOne().then(data => {
                return data.amount;
                });
    
                const investor = await Investorfunds.findOne().then(data => {
                return data.amount;
                });
    
                try {
                const header = await Gameactivity.findOne();
                const grind = await Communityactivity.findOne({ type: "grinding" });
                const quest = await Communityactivity.findOne({ type: "quest" });
    
                const value = grind.amount + quest.amount + header.total + ads + investor;
                const fnal = value / mc.amount;
                return fnal;
                } catch (error) {
                console.error("Error in findOne calls:", error);
                throw error; // Re-throw the error to be caught by the outer catch block
                }
            })
            .catch(error => res.status(500).json({ message: "failed", data: error.message }));
    
    
            const activitypoints = data.find(e => e.wallettype === "activitypoints")
            const adspoints = data.find(e => e.wallettype === "adspoints")
            const purchasepoints = data.find(e => e.wallettype === "purchasepoints")
            const taskpoints = data.find(e => e.wallettype === "taskpoints")
            const recruitpoints = data.find(e => e.wallettype === "directpoints")
            const totalpoints = data.find(e => e.wallettype === "totalpoints")
            const monstergemfarm = data.find(e => e.wallettype === "monstergemfarm")
            const monstergemunilevel = data.find(e => e.wallettype === "monstergemunilevel")
            const monstercoin = data.find(e => e.wallettype === "monstercoin")
            const balance = data.find(e => e.wallettype === "balance")
            const totalincome = data.find(e => e.wallettype === "totalincome")
            const grouppoints = data.find(e => e.wallettype === "grouppoints")
            const subscriberincome = (monstercoin.amount * mcvalue)
            const summary = {
                "activitypoints": activitypoints.amount,
                "adspoints": adspoints.amount,
                "purchasepoints": purchasepoints.amount,
                "taskpoints": taskpoints.amount,
                "recruitpoints": recruitpoints.amount,
                "totalpoints": totalpoints.amount,
                "monstergemfarm": monstergemfarm.amount,
                "monstergemunilevel": monstergemunilevel.amount,
                "monstercoin": monstercoin.amount,
                "balance": balance.amount,
                "totalincome": totalincome.amount,
                "subscriberincome": subscriberincome,
                "email": playerdetails.email,
                "phone": playerdetails.phone,
                'poolstatus': pooldetail.status,
                'poolrank': pooldetail.rank,
                "grouppoints": grouppoints?.amount,
            }

        await WalletsCutoff.find({owner: user._id})
        .then(async item => {

            const activitypoints = item.find(e => e.wallettype === "activitypoints")
            const adspoints = item.find(e => e.wallettype === "adspoints")
            const purchasepoints = item.find(e => e.wallettype === "purchasepoints")
            const taskpoints = item.find(e => e.wallettype === "taskpoints")
            const recruitpoints = item.find(e => e.wallettype === "directpoints")
            const totalpoints = item.find(e => e.wallettype === "totalpoints")
            const grouppoints = item.find(e => e.wallettype === "grouppoints")

            const percutoff = {
                "activitypoints": activitypoints.amount,
                "adspoints": adspoints.amount,
                "purchasepoints": purchasepoints.amount,
                "taskpoints": taskpoints.amount,
                "recruitpoints": recruitpoints.amount,
                "totalpoints": totalpoints.amount,
                "grouppoints": grouppoints?.amount,
            }

            res.json({message: "success", data: summary, data2: percutoff})
        })
        .catch(error => res.status(500).json({ message: "failed", data: error.message }));
    
            
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
   
}

exports.changepassmember = (req, res) => {
    const {username, password} = req.body;

    Gameusers.findOne({username: username})
    .then(async user => {
        if(user){
            if(user.status === "banned"){
                res.json({message: "failed", data: 'This account has been banned'})
            } else {
                let newpassword = await encrypt(password)
                Gameusers.findOneAndUpdate({username: username}, {password: newpassword})
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

exports.updatememberdetail = (req, res) => {
    const { username, email, phone } = req.body
    Gameusers.findOne({username: username})
    .then(user => {
        Playerdetails.findOneAndUpdate({owner: user._id}, {email: email, phone: phone}, {new: true})
        .then(data => {
            res.json({message: "success", data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.memberwallethistory = (req, res) => {
    const { username } = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        Wallethistory.find({owner: user._id})
        .sort({createdAt: -1})
        .then(data => {
            res.json({message: 'success', data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.joined = async (req, res) => {
    try {
        // Count of overall gameusers data
        const overallGameusersCount = await Gameusers.countDocuments({status: 'active'});

        // Count of gameusers data for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayGameusersCount = await Gameusers.countDocuments({ createdAt: { $gte: today }, status: 'active' });

        // Count of pooldetails data based on subscription value
        const pearlCount = await Pooldetails.countDocuments({ subscription: 'Pearl' });
        const rubyCount = await Pooldetails.countDocuments({ subscription: 'Ruby' });
        const emeraldCount = await Pooldetails.countDocuments({ subscription: 'Emerald' });
        const diamondCount = await Pooldetails.countDocuments({ subscription: 'Diamond' });

        const summary = {
            "totaljoin": overallGameusersCount,
            'todayjoin': todayGameusersCount,
            'pearl': pearlCount,
            'ruby': rubyCount,
            'emerald': emeraldCount,
            'diamond': diamondCount,
        }

        // Respond with the counts
        res.json({message: 'success', data: summary});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.banmember = (req, res) => {
    const { username , reason } = req.body

    const ban = {
        status: 'banned',
        bandate: new Date().toLocaleString(),
        banreason: reason
    }
    Gameusers.findOneAndUpdate({username: username}, ban)
    .then(data => {
        if(data){
            res.json({message: 'success'})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.banmultiplemember = (req, res) => {
    const { usernames , reason } = req.body

    const ban = {
        status: 'banned',
        bandate: new Date().toLocaleString(),
        banreason: reason
    }

    Gameusers.updateMany({username: { $in: usernames }}, ban)
    .then(data => {
        if(data){
            res.json({message: 'success'})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.unbanmember = (req, res) => {
    const { username } = req.body

    const unban = {
        status: 'active',
        bandate: '',
        banreason: ''
    }

    Gameusers.findOneAndUpdate({username: username}, unban)
    .then(data => {
        if(data){
            res.json({message: 'success'})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.unbanmultiplemember = (req, res) => {
    const { usernames } = req.body

    const unban = {
        status: 'active',
        bandate: '',
        banreason: ''
    }

    Gameusers.updateMany({username: { $in: usernames }}, unban)
    .then(data => {
        if(data){
            res.json({message: 'success'})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.memberbannedlist = (req, res) => {

    Gameusers.find({status: "banned"})
    .select('bandate username banreason')
    .then(data => {
        if(data){
            res.json({message: 'success', data: data})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.bannedcount = async (req, res) => {
    try {
        // Count of overall gameusers data
        const overallGameusersCount = await Gameusers.countDocuments({ status: 'banned' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        function convertToCustomFormat(dateStr) {
            const dateObj = new Date(dateStr);
            return dateObj;
        }

        const todays = convertToCustomFormat(today);

        // Find documents with bandate greater than or equal to today
        const todayGameusersCount = await Gameusers.find({ 
            status: 'banned',
            bandate: { $gte: todays.toLocaleString() }
        });

        const summary = {
            totalbanned: overallGameusersCount,
            todaybanned: todayGameusersCount.length, // Use length to get the count
        };

        // Respond with the counts
        res.json({ message: 'success', data: summary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.filterwallet = (req, res) => {
    const { filter, username } = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        Wallethistory.find({owner: user._id, type: filter})
        .then(data => {
            res.json({message: 'success', data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.findtopearners = (req, res) => {

    Ingameleaderboard.find()
    .populate({
        path: "owner",
        select: "username"
    })
    .sort({amount: -1})
    .limit(100)
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.findnetwork = async (req, res) => {
    const { username } = req.body;
    const id = await Gameusers.findOne({ username: username })
        .then((user) => {
            return user._id;
        });

    const downline = await Gameusers.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id),
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

exports.fiesta = (req, res) => {
    const { type } = req.body

    Fiesta.find({type: type})
    .populate({
        path: "owner",
        select: "username"
    })
    .sort({amount: -1})
    .limit(15)
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));

}

exports.sponsor = (req, res) => {
    const { type } = req.body

    Sponsor.find({type: type})
    .populate({
        path: "owner",
        select: "username"
    })
    .sort({amount: -1})
    .limit(15)
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));

}

exports.getmembertools = (req, res) => {
    const { username } = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        Equipment.find({owner: user._id})
        .then(data => {
            res.json({message: "success", data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.getmemberclock = (req, res) => {
    const {username} = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        Clock.find({owner: user._id})
        .then(data => {
            res.json({message: "success", data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));

}

exports.getmembercosmetics = (req, res) => {
    const {username, type} = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        Cosmetics.find({owner: user._id, type: type})
        .then(data => {
            res.json({message: "success", data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.getmembersupplies = (req, res) => {
    const {username, type} = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        Energyinventories.find({owner: user._id, type: type})
        .then(data => {
            res.json({message: "success", data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.getmemberpaydetail = (req, res) => {
    const {username} = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        DragonPaymentdetails.findOne({owner: user._id})
        .then(data => {
            res.json({message: 'success', data: data})
        })
        .catch(error => res.status(500).json({ message: "failed", data: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    
}

exports.paymentdetail = async (req, res) => {
    const { 
        firstname,
        middlename,
        lastname,
        email,
        mobilenumber,
        birthdate,
        nationality,
        street1, 
        street2, 
        barangay, 
        city, 
        province, 
        country,
        paymentmethod,
        paymentdetail,
        username
    } = req.body
    const id = await Gameusers.findOne({username: username}).then(data => data._id)
    const currency = paymentmethod == 'CRYPTO' ? 'USDT' : 'PHP'
    const paymentoption = paymentmethod == 'CRYPTO' ? 'Manual' : 'Automatic'

    const forgame = {
        owner: id,
        paymentoption: paymentoption,
        paymentmethod: paymentmethod,
        currency: currency
    }

    const fordragonpay = {
        owner: id,
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        email: email,
        mobilenumber: mobilenumber,
        birthdate: birthdate,
        nationality: nationality,
        address: {
            Street1: street1,
            Street2: street2,
            Barangay: barangay,
            City: city,
            Province: province,
            Country: country
        },
        paymentmethod: paymentmethod,
        paymentdetail: paymentdetail
    }

    const isexsist = await Paymentdetails.findOne({owner: id})
    .then(data => {
        if(data){
            return true
        } else {
            return false
        }
    })
    .catch(error => res.status(500).json({ message: "failed", data: error.message }));

    const isexsist1 = await DragonPaymentdetails.findOne({owner: id})
    .then(data => {
        if(data){
            return true
        } else {
            return false
        }
    })
    .catch(error => res.status(500).json({ message: "failed", data: error.message }));

    if(isexsist && isexsist1){
        await Paymentdetails.findOneAndUpdate({owner: id}, forgame)
        await DragonPaymentdetails.findOneAndUpdate({owner: id}, fordragonpay)

        res.json({message: "success", data: "Save Successfully"})
    } else {
        await Paymentdetails.create(forgame)
        await DragonPaymentdetails.create(fordragonpay)

        res.json({message: "success", data: "Save Successfully"})
    }

}

exports.getmembertask = async (req, res) => {
    const { username } = req.body

    const id = await Gameusers.findOne({username: username}).then(data => data._id)
    const pool = await Pooldetails.findOne({owner: id}).then(data => data)

    const summary = {
        "subscription": pool.subscription,

    }

    res.json({message: "success", data: summary})
}

exports.gameannouncement = (req, res) => {
    const { title, description } = req.body

    const data = {
        title: title,
        description: description
    }

    Gameannouncement.create(data)
    .then((data) => {
        res.json({message: 'success', data: data})
    })
    .catch(error => res.status(500).json({ message: "failed", data: error.message }));
}

exports.maintenance = (req, res) => {
    const {type, value} = req.body

    Maintenance.findOneAndUpdate({type: type}, {value: value})
    .then(data => {
        if(data){
            res.json({message: "success"})
        }
    })
    .catch(error => res.status(500).json({ message: "failed", data: error.message }));
}

exports.maintenancevalue = (req, res) => {

    Maintenance.find()
    .select('type value')
    .then(data => {
        const maintenancefullgame = data.find(e => e.type == "maintenancefullgame")
        const maintenancegrinding = data.find(e => e.type == "maintenancegrinding")
        const maintenancesubscription = data.find(e => e.type == "maintenancesubscription")
        const maintenanceitems = data.find(e => e.type == "maintenanceitems")
        const maintenancefiestagame = data.find(e => e.type == "maintenancefiestagame")
        const maintenancesponsor = data.find(e => e.type == "maintenancesponsor")
        const maintenancecashoutmanual = data.find(e => e.type == "maintenancecashoutmanual")
        const maintenancecashoutautomated = data.find(e => e.type == "maintenancecashoutautomated")
        const maintenancecashinmanual = data.find(e => e.type == "maintenancecashinmanual")
        const maintenancecashinautomated = data.find(e => e.type == "maintenancecashinautomated")

        const summary = {
            "maintenancefullgame": maintenancefullgame,
            "maintenancegrinding": maintenancegrinding,
            "maintenancesubscription": maintenancesubscription,
            "maintenanceitems": maintenanceitems,
            "maintenancefiestagame": maintenancefiestagame,
            "maintenancesponsor": maintenancesponsor,
            "maintenancecashoutmanual": maintenancecashoutmanual,
            "maintenancecashoutautomated": maintenancecashoutautomated,
            "maintenancecashinmanual": maintenancecashinmanual,
            "maintenancecashinautomated": maintenancecashinautomated,
        }

        res.json({message: "success", data: summary})
    })
    .catch(error => res.status(500).json({ message: "failed", data: error.message }));
}