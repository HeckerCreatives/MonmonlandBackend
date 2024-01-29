const Wallets = require('../Gamemodels/Wallets')
const Communityactivity = require("../Models/Communityactivity")
const Monmoncoin = require("../Models/Monmoncoin")
const Gameactivity = require("../Models/Gameactivity")
const Ads = require("../Models/Ads")
const Investorfunds = require("../Models/Investorfunds")
const Wallethistory = require("../Gamemodels/Wallethistory")
const Cashouthistory = require('../Gamemodels/Cashouthistory')
const WalletsCutoff = require('../Gamemodels/Walletscutoff')
const Pooldetails = require("../Gamemodels/Pooldetails")
const DragonPaymentdetails = require('../Models/Paymentdetails')
const Paymentdetails = require("../Gamemodels/Paymentdetails")
const Analytics = require("../Gamemodels/Analytics")
const GrindingHistory = require("../Gamemodels/Grindinghistory")
const Payouthistory = require("../Models/Payout")
const Dragonpayoutrequest = require('../Models/Dragonpayoutrequest')
const { default: mongoose } = require('mongoose')


exports.find = async (req, res) => {
    
    Wallets.find({owner: req.user.id})
    .then(async data => {

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

        const pooldetail = await Pooldetails.findOne({owner: req.user.id})
        .select('status rank subscription')
        .then(pool => {
            return pool
        })
        .catch(error => res.status(500).json({ message: "failed", data: error.message }));



        const activitypoints = data.find(e => e.wallettype === "activitypoints")
        const adspoints = data.find(e => e.wallettype === "adspoints")
        const purchasepoints = data.find(e => e.wallettype === "purchasepoints")
        const taskpoints = data.find(e => e.wallettype === "taskpoints")
        const directpoints = data.find(e => e.wallettype === "directpoints")
        const totalpoints = data.find(e => e.wallettype === "totalpoints")
        const monstergemfarm = data.find(e => e.wallettype === "monstergemfarm")
        const monstergemunilevel = data.find(e => e.wallettype === "monstergemunilevel")
        const monstercoin = data.find(e => e.wallettype === "monstercoin")
        const balance = data.find(e => e.wallettype === "balance")
        const totalincome = data.find(e => e.wallettype === "totalincome")
        const grouppoints = data.find(e => e.wallettype === "grouppoints")
        const subscriberincome = (monstercoin.amount * mcvalue)

        const totalaccumulative = {
            "activitypoints": activitypoints.amount,
            "adspoints": adspoints.amount,
            "purchasepoints": purchasepoints.amount,
            "taskpoints": taskpoints.amount,
            "recruitpoints": directpoints.amount,
            "totalpoints": totalpoints.amount,
            "monstergemfarm": monstergemfarm.amount,
            "monstergemunilevel": monstergemunilevel.amount,
            "monstercoin": monstercoin.amount,
            "balance": balance.amount,
            "totalincome": totalincome.amount,
            "subscriberincome": subscriberincome,
            "grouppoints": grouppoints?.amount,
            'poolstatus': pooldetail.status,
            'poolrank': pooldetail.rank,
            'poolsubscription': pooldetail.subscription
        }

        await WalletsCutoff.find({owner: req.user.id})
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

            res.json({message: "success", data: totalaccumulative, data2: percutoff})
        })
        .catch(error => res.status(500).json({ message: "failed", data: error.message }));


        
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.findwallethistory = (req, res) => {

    Wallethistory.find({owner: req.user.id})
    .sort({createdAt: -1})
    .then(data => {
        res.json({message: 'success', data: data})
    })
    .catch(error => res.status(500).json({ message: "failed", data: error.message }));
}

exports.findcashouthistory = (req, res) => {
    Cashouthistory.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(req.user.id) }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $lookup: {
                from: 'dragonpayoutrequests',
                localField: 'id',
                foreignField: 'id',
                as: 'payoutRequest'
            }
        },
        {
            $unwind: { path: '$payoutRequest', preserveNullAndEmptyArrays: true }
        },
        {
            $lookup: {
                from: 'payouthistories',
                localField: 'id',
                foreignField: 'id',
                as: 'payoutHistory'
            }
        },
        {
            $unwind: { path: '$payoutHistory', preserveNullAndEmptyArrays: true }
        },
        {
            $project: {
                amount: 1,
                payoutRequestStatus: { $ifNull: ['$payoutRequest.status', null] },
                payoutHistoryStatus: { $ifNull: ['$payoutHistory.status', null] },
                createdAt: 1
            }
        }
    ])
    .then(data => {
        res.json({ message: 'success', data: data });
    })
    .catch(error => res.status(500).json({ message: 'failed', data: error.message }));
};

// exports.findmanualcashouthistory = (req, res) => {
//     // Payouthistory.aggregate([
//     //     {
//     //         $match: { username: req.user.username  }
//     //     },
//     //     {
//     //         $sort: { createdAt: -1 }
//     //     },
//     //     {
//     //         $project: {
//     //             amount: 1,
//     //             status: 1,
//     //             createdAt: 1
//     //         }
//     //     }
//     // ])
//     // .then(data => {
//     //     res.json({ message: 'success', data: data });
//     // })
//     // .catch(error => res.status(500).json({ message: 'failed', data: error.message }));

//     Cashouthistory.aggregate([
//         {
//             $match: { owner: new mongoose.Types.ObjectId(req.user.id) }
//         },
//         {
//             $sort: { createdAt: -1 }
//         },
//         {
//             $lookup: {
//                 from: 'dragonpayoutrequests',
//                 localField: 'id',
//                 foreignField: 'id',
//                 as: 'payoutRequest'
//             }
//         },
//         {
//             $unwind: { path: '$payoutRequest', preserveNullAndEmptyArrays: true }
//         },
//         {
//             $lookup: {
//                 from: 'payouthistories',
//                 localField: 'id',
//                 foreignField: 'id',
//                 as: 'payoutHistory'
//             }
//         },
//         {
//             $unwind: { path: '$payoutHistory', preserveNullAndEmptyArrays: true }
//         },
//         {
//             $project: {
//                 amount: 1,
//                 payoutRequestStatus: { $ifNull: ['$payoutRequest.status', null] },
//                 payoutHistoryStatus: { $ifNull: ['$payoutHistory.status', null] },
//                 createdAt: 1
//             }
//         }
//     ])
//     .then(data => {
//         res.json({ message: 'success', data: data });
//     })
//     .catch(error => res.status(500).json({ message: 'failed', data: error.message }));
    
    
// }

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
        paymentdetail
    } = req.body

    const currency = paymentmethod == 'CRYPTO' ? 'USDT' : 'PHP'
    const paymentoption = paymentmethod == 'CRYPTO' ? 'Manual' : 'Automatic'

    const forgame = {
        owner: req.user.id,
        paymentoption: paymentoption,
        paymentmethod: paymentmethod,
        currency: currency
    }

    const fordragonpay = {
        owner: req.user.id,
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

    const isexsist = await Paymentdetails.findOne({owner: req.user.id})
    .then(data => {
        if(data){
            return true
        } else {
            return false
        }
    })
    .catch(error => res.status(500).json({ message: "failed", data: error.message }));

    const isexsist1 = await DragonPaymentdetails.findOne({owner: req.user.id})
    .then(data => {
        if(data){
            return true
        } else {
            return false
        }
    })
    .catch(error => res.status(500).json({ message: "failed", data: error.message }));

    if(isexsist && isexsist1){
        await Paymentdetails.findOneAndUpdate({owner: req.user.id}, forgame)
        await DragonPaymentdetails.findOneAndUpdate({owner: req.user.id}, fordragonpay)

        res.json({message: "success", data: "Save Successfully"})
    } else {
        await Paymentdetails.create(forgame)
        await DragonPaymentdetails.create(fordragonpay)

        res.json({message: "success", data: "Save Successfully"})
    }

}

exports.findpaymentdetail = (req, res) => {
    
    DragonPaymentdetails.findOne({owner: req.user.id})
    .then(data => {
        res.json({message: 'success', data: data})
    })
    .catch(error => res.status(500).json({ message: "failed", data: error.message }));
}

exports.subscommission = (req, res) => {
    Wallethistory.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user.id),
                type: "Subscription Unilevel"
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $unwind: '$totalAmount'
        },
        {
            $project: {
                _id: 0,
                totalAmount: 1
            }
        }
    ])
    .then(data => {
        res.json({message: 'success', data: data[0]})
    })
    .catch(error => res.status(500).json({ message: "failed", data: error.message }));
}

exports.filterwallet = (req, res) => {
    const { filter } = req.body

    Wallethistory.find({owner: req.user.id, type: filter})
    .sort({createdAt: -1})
    .then(data => {
        res.json({message: 'success', data: data})
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.findtransactionhistory = (req, res) => {
    Analytics.find({owner: req.user.id})
        .sort({createdAt: -1})
        .then(data => {
            res.json({message: 'success', data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.findgrindinghistory = (req, res) => {
    GrindingHistory.find({owner: req.user.id})
        .sort({createdAt: -1})
        .then(data => {
            res.json({message: 'success', data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.filtertransaction = (req, res) => {
    const { filter } = req.body

    const regex = new RegExp(filter, 'i'); // 'i' for case-insensitive

    Analytics.find({ owner: req.user.id, type: { $regex: regex } })
        .then(data => {
            res.json({ message: 'success', data: data })
        })
        .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
}

exports.filtergrinding = (req, res) => {
    const { filter} = req.body

    // Create a date range for the entire day
    const startDate = new Date(filter);
    startDate.setHours(0, 0, 0, 0); // Set to the beginning of the day
    const endDate = new Date(filter);
    endDate.setHours(23, 59, 59, 999); // Set to the end of the day

    GrindingHistory.find({owner: req.user.id, createdAt: { $gte: startDate, $lte: endDate }})
    .then(data => {
        res.json({message: 'success', data: data})
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}