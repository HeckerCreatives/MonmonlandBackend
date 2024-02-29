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
const { nanoid } = require("nanoid")
const Buytokenhistory = require("../Gamemodels/Buytokenhistory")
const Token = require("../Gamemodels/Token")
const TokenTransactions = require("../Gamemodels/Tokentransaction")
const SubsAccumulated = require("../Models/SubsAccumulated")
const { checkmaintenance } = require("../Utils/utils")
const { sendcommissiontounilevel, checkwalletamount, addwalletamount, getwalletamount, checkairdroplimit, addtoken } = require("../Utils/Walletutils")
const { getsubsamount, getpooldetails } = require("../Utils/Pooldetailsutils")
const { addanalytics } = require("../Utils/Analytics")
const { computecomplan } = require("../Utils/Communityactivityutils")
const { addtototalfarmmc } = require("../Utils/Gameutils")
const Gameusers = require('../Gamemodels/Gameusers')
const Airdroptransaction = require('../Gamemodels/Airdroptransaction')
const Airdropquest = require('../Gamemodels/Airdropquest')

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

        // const playstatus = await Gameusers.findOne({_id: req.user.id}).then(e => e.playstatus)

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
            'poolsubscription': pooldetail.subscription,
            // 'playstatus': playstatus
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

exports.buymmt = async (req, res) => {
    const { amount, tokenreceive, transactiontype } = req.body
    const customid = nanoid(10)
    if(transactiontype == "walletbalance"){
        const balance = await Wallets.findOne({owner: req.user.id, wallettype: 'balance'}).then(data => data.amount)

        if(balance < amount){
            return res.json({message: 'failed', data: 'Not Enough Balance'})
        }

        await Wallets.findOneAndUpdate({owner: req.user.id, wallettype: 'balance'}, {$inc: {amount: -amount}})
        .then(async data => {

            if(data){
                await Token.findOne({owner: req.user.id, type: "MMT"})
                .then(async token => {
                    if(token){
                        const buytoken = {
                            owner: req.user.id,
                            id: customid,
                            type: "MMT",
                            tokenreceive: tokenreceive,
                            amount: amount,
                            transactiontype: transactiontype
                        }
                        
                        const wallet = {
                            owner: req.user.id,
                            type: "Buy MMT Token",
                            description: "Buy MMT Token",
                            amount: amount,
                            historystructure: "mmt token buy using wallet balance"
                        }
                        
                        await Token.findOneAndUpdate({owner: req.user.id, type: "MMT"},{$inc:{amount: tokenreceive}})
                        await Buytokenhistory.create(buytoken)
                        await Wallethistory.create(wallet)
                        await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                        res.json({message: "success", data: "Buy Token Successfully"})
                    } else {
                        const tokenwallet = {
                            owner: req.user.id,
                            type: "MMT",
                            amount: tokenreceive
                        }

                        await Token.create(tokenwallet)

                        const buytoken = {
                            owner: req.user.id,
                            id: customid,
                            type: "MMT",
                            tokenreceive: tokenreceive,
                            amount: amount,
                            transactiontype: transactiontype
                        }
                        
                        const wallet = {
                            owner: req.user.id,
                            type: "Buy MMT Token",
                            description: "Buy MMT Token",
                            amount: amount,
                            historystructure: "mmt token buy using wallet balance"
                        }
                
                        await Buytokenhistory.create(buytoken)
                        await Wallethistory.create(wallet)
                        await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                        res.json({message: "success", data: "Buy Token Successfully"})
                    }
                    
                })
                .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
            }

        
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    } else if (transactiontype == "monstergem"){
        const balance1 = await Wallets.findOne({owner: req.user.id, wallettype: 'monstergemunilevel'}).then(data => data.amount)

        const balance2 = await Wallets.findOne({owner: req.user.id, wallettype: 'monstergemfarm'}).then(data => data.amount)

        if(balance1 >= amount){
            await Wallets.findOneAndUpdate({owner: req.user.id, wallettype: 'monstergemunilevel'}, {$inc: {amount: -amount}})
            .then(async data => {

                if(data){
                    await Token.findOne({owner: req.user.id, type: "MMT"})
                    .then(async token => {
                        if(token){
                            const buytoken = {
                                owner: req.user.id,
                                id: customid,
                                type: "MMT",
                                tokenreceive: tokenreceive,
                                amount: amount,
                                transactiontype: transactiontype
                            }
                            
                            const wallet = {
                                owner: req.user.id,
                                type: "Buy MMT Token",
                                description: "Buy MMT Token",
                                amount: amount,
                                historystructure: "mmt token buy using monstegemunilevel balance"
                            }
                            
                            await Token.findOneAndUpdate({owner: req.user.id, type: "MMT"},{$inc:{amount: tokenreceive}})
                            await Buytokenhistory.create(buytoken)
                            await Wallethistory.create(wallet)
                            await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                            res.json({message: "success", data: "Buy Token Successfully"})
                        } else {
                            const tokenwallet = {
                                owner: req.user.id,
                                type: "MMT",
                                amount: tokenreceive
                            }

                            await Token.create(tokenwallet)

                            const buytoken = {
                                owner: req.user.id,
                                id: customid,
                                type: "MMT",
                                tokenreceive: tokenreceive,
                                amount: amount,
                                transactiontype: transactiontype
                            }
                            
                            const wallet = {
                                owner: req.user.id,
                                type: "Buy MMT Token",
                                description: "Buy MMT Token",
                                amount: amount,
                                historystructure: "mmt token buy using monstergemunilevel balance"
                            }
                    
                            await Buytokenhistory.create(buytoken)
                            await Wallethistory.create(wallet)
                            await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                            res.json({message: "success", data: "Buy Token Successfully"})
                        }
                        
                    })
                    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
                }

            
            })
            .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
        } else if (balance2 >= amount){
            await Wallets.findOneAndUpdate({owner: req.user.id, wallettype: 'monstergemfarm'}, {$inc: {amount: -amount}})
            .then(async data => {

                if(data){
                    await Token.findOne({owner: req.user.id, type: "MMT"})
                    .then(async token => {
                        if(token){
                            const buytoken = {
                                owner: req.user.id,
                                id: customid,
                                type: "MMT",
                                tokenreceive: tokenreceive,
                                amount: amount,
                                transactiontype: transactiontype
                            }
                            
                            const wallet = {
                                owner: req.user.id,
                                type: "Buy MMT Token",
                                description: "Buy MMT Token",
                                amount: amount,
                                historystructure: "mmt token buy using monstergemfarm balance"
                            }
                            
                            await Token.findOneAndUpdate({owner: req.user.id, type: "MMT"},{$inc:{amount: tokenreceive}})
                            await Buytokenhistory.create(buytoken)
                            await Wallethistory.create(wallet)
                            await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                            res.json({message: "success", data: "Buy Token Successfully"})
                        } else {
                            const tokenwallet = {
                                owner: req.user.id,
                                type: "MMT",
                                amount: tokenreceive
                            }

                            await Token.create(tokenwallet)

                            const buytoken = {
                                owner: req.user.id,
                                id: customid,
                                type: "MMT",
                                tokenreceive: tokenreceive,
                                amount: amount,
                                transactiontype: transactiontype
                            }
                            
                            const wallet = {
                                owner: req.user.id,
                                type: "Buy MMT Token",
                                description: "Buy MMT Token",
                                amount: amount,
                                historystructure: "mmt token buy using monstergemfarm balance"
                            }
                    
                            await Buytokenhistory.create(buytoken)
                            await Wallethistory.create(wallet)
                            await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                            res.json({message: "success", data: "Buy Token Successfully"})
                        }
                        
                    })
                    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
                }

            
            })
            .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
        } else {
            res.json({message: "failed", data: "You don't have enough monster gem balance"})
        }
    } else if (transactiontype == "bnb"){
        await Token.findOne({owner: req.user.id, type: "MMT"})
        .then(async token => {
            if(token){
                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MMT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MMT Token",
                    description: "Buy MMT Token (BNB)",
                    amount: amount,
                    historystructure: "mmt token buy using bnb balance"
                }
                
                await Token.findOneAndUpdate({owner: req.user.id, type: "MMT"},{$inc:{amount: tokenreceive}})
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            } else {
                const tokenwallet = {
                    owner: req.user.id,
                    type: "MMT",
                    amount: tokenreceive
                }

                await Token.create(tokenwallet)

                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MMT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MMT Token",
                    description: "Buy MMT Token (BNB)",
                    amount: amount,
                    historystructure: "mmt token buy using bnb balance"
                }
        
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            }
            
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    } else if (transactiontype == "usdt"){
        await Token.findOne({owner: req.user.id, type: "MMT"})
        .then(async token => {
            if(token){
                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MMT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MMT Token",
                    description: "Buy MMT Token (USDT)",
                    amount: amount,
                    historystructure: "mmt token buy using usdt balance"
                }
                
                await Token.findOneAndUpdate({owner: req.user.id, type: "MMT"},{$inc:{amount: tokenreceive}})
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            } else {
                const tokenwallet = {
                    owner: req.user.id,
                    type: "MMT",
                    amount: tokenreceive
                }

                await Token.create(tokenwallet)

                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MMT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MMT Token",
                    description: "Buy MMT Token (USDT)",
                    amount: amount,
                    historystructure: "mmt token buy using usdt balance"
                }
        
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            }
            
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    } else if (transactiontype == "busd"){
        await Token.findOne({owner: req.user.id, type: "MMT"})
        .then(async token => {
            if(token){
                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MMT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MMT Token",
                    description: "Buy MMT Token (BUSD)",
                    amount: amount,
                    historystructure: "mmt token buy using busd balance"
                }
                
                await Token.findOneAndUpdate({owner: req.user.id, type: "MMT"},{$inc:{amount: tokenreceive}})
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            } else {
                const tokenwallet = {
                    owner: req.user.id,
                    type: "MMT",
                    amount: tokenreceive
                }

                await Token.create(tokenwallet)

                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MMT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MMT Token",
                    description: "Buy MMT Token (BUSD)",
                    amount: amount,
                    historystructure: "mmt token buy using busd balance"
                }
        
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            }
            
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    } else if (transactiontype == "usdc"){
        await Token.findOne({owner: req.user.id, type: "MMT"})
        .then(async token => {
            if(token){
                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MMT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MMT Token",
                    description: "Buy MMT Token (USDC)",
                    amount: amount,
                    historystructure: "mmt token buy using usdc balance"
                }
                
                await Token.findOneAndUpdate({owner: req.user.id, type: "MMT"},{$inc:{amount: tokenreceive}})
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            } else {
                const tokenwallet = {
                    owner: req.user.id,
                    type: "MMT",
                    amount: tokenreceive
                }

                await Token.create(tokenwallet)

                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MMT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MMT Token",
                    description: "Buy MMT Token (USDC)",
                    amount: amount,
                    historystructure: "mmt token buy using usdc balance"
                }
        
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            }
            
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    } else if (transactiontype == "xrp"){
        await Token.findOne({owner: req.user.id, type: "MMT"})
        .then(async token => {
            if(token){
                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MMT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MMT Token",
                    description: "Buy MMT Token (XRP)",
                    amount: amount,
                    historystructure: "mmt token buy using xrp balance"
                }
                
                await Token.findOneAndUpdate({owner: req.user.id, type: "MMT"},{$inc:{amount: tokenreceive}})
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            } else {
                const tokenwallet = {
                    owner: req.user.id,
                    type: "MMT",
                    amount: tokenreceive
                }

                await Token.create(tokenwallet)

                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MMT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MMT Token",
                    description: "Buy MMT Token (XRP)",
                    amount: amount,
                    historystructure: "mmt token buy using xrp balance"
                }
        
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            }
            
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    } else if (transactiontype == "doge"){
        await Token.findOne({owner: req.user.id, type: "MMT"})
        .then(async token => {
            if(token){
                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MMT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MMT Token",
                    description: "Buy MMT Token (DOGE)",
                    amount: amount,
                    historystructure: "mmt token buy using doge balance"
                }
                
                await Token.findOneAndUpdate({owner: req.user.id, type: "MMT"},{$inc:{amount: tokenreceive}})
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            } else {
                const tokenwallet = {
                    owner: req.user.id,
                    type: "MMT",
                    amount: tokenreceive
                }

                await Token.create(tokenwallet)

                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MMT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MMT Token",
                    description: "Buy MMT Token (DOGE)",
                    amount: amount,
                    historystructure: "mmt token buy using doge balance"
                }
        
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mmttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            }
            
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    }

}

exports.buymmc = async (req, res) => {
    const { amount, tokenreceive, transactiontype } = req.body

    const customid = nanoid(10)

    if(transactiontype == "walletbalance"){
        const balance = await Wallets.findOne({owner: req.user.id, wallettype: 'balance'}).then(data => data.amount)

        if(balance < amount){
            return res.json({message: 'failed', data: 'Not Enough Balance'})
        }
    
        await Wallets.findOneAndUpdate({owner: req.user.id, wallettype: 'balance'}, {$inc: {amount: -amount}})
        .then(async data => {
    
            if(data){
                await Token.findOne({owner: req.user.id, type: "MCT"})
                .then(async token => {
                    if(token){
                        const buytoken = {
                            owner: req.user.id,
                            id: customid,
                            type: "MCT",
                            tokenreceive: tokenreceive,
                            amount: amount,
                            transactiontype: transactiontype
                        }
                        
                        const wallet = {
                            owner: req.user.id,
                            type: "Buy MCT Token",
                            description: "Buy MCT Token",
                            amount: amount,
                            historystructure: "mct token buy using wallet balance"
                        }
    
                        await Token.findOneAndUpdate({owner: req.user.id, type: "MCT"}, {$inc: {amount: tokenreceive}})
                        await Buytokenhistory.create(buytoken)
                        await Wallethistory.create(wallet)
                        await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                        res.json({message: "success", data: "Buy Token Successfully"})
                    } else {
                        const tokenwallet = {
                            owner: req.user.id,
                            type: "MCT",
                            amount: tokenreceive
                        }
    
                        await Token.create(tokenwallet)
    
                        const buytoken = {
                            owner: req.user.id,
                            id: customid,
                            type: "MCT",
                            tokenreceive: tokenreceive,
                            amount: amount,
                            transactiontype: transactiontype
                        }
                        
                        const wallet = {
                            owner: req.user.id,
                            type: "Buy MCT Token",
                            description: "Buy MCT Token",
                            amount: amount,
                            historystructure: "mct token buy using wallet balance"
                        }
                
                        await Buytokenhistory.create(buytoken)
                        await Wallethistory.create(wallet)
                        await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                        res.json({message: "success", data: "Buy Token Successfully"})
                    }
                    
                })
                .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
            }
    
           
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    } else if (transactiontype == "monstergem"){
        const balance1 = await Wallets.findOne({owner: req.user.id, wallettype: 'monstergemunilevel'}).then(data => data.amount)

        const balance2 = await Wallets.findOne({owner: req.user.id, wallettype: 'monstergemfarm'}).then(data => data.amount)

        if(balance1 >= amount){
            await Wallets.findOneAndUpdate({owner: req.user.id, wallettype: 'monstergemunilevel'}, {$inc: {amount: -amount}})
            .then(async data => {
        
                if(data){
                    await Token.findOne({owner: req.user.id, type: "MCT"})
                    .then(async token => {
                        if(token){
                            const buytoken = {
                                owner: req.user.id,
                                id: customid,
                                type: "MCT",
                                tokenreceive: tokenreceive,
                                amount: amount,
                                transactiontype: transactiontype
                            }
                            
                            const wallet = {
                                owner: req.user.id,
                                type: "Buy MCT Token",
                                description: "Buy MCT Token",
                                amount: amount,
                                historystructure: "mct token buy using monstergemunilevel balance"
                            }
        
                            await Token.findOneAndUpdate({owner: req.user.id, type: "MCT"}, {$inc: {amount: tokenreceive}})
                            await Buytokenhistory.create(buytoken)
                            await Wallethistory.create(wallet)
                            await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                            res.json({message: "success", data: "Buy Token Successfully"})
                        } else {
                            const tokenwallet = {
                                owner: req.user.id,
                                type: "MCT",
                                amount: tokenreceive
                            }
        
                            await Token.create(tokenwallet)
        
                            const buytoken = {
                                owner: req.user.id,
                                id: customid,
                                type: "MCT",
                                tokenreceive: tokenreceive,
                                amount: amount
                            }
                            
                            const wallet = {
                                owner: req.user.id,
                                type: "Buy MCT Token",
                                description: "Buy MCT Token",
                                amount: amount,
                                historystructure: "mct token buy using monstergemunilevel balance"
                            }
                    
                            await Buytokenhistory.create(buytoken)
                            await Wallethistory.create(wallet)
                            await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                            res.json({message: "success", data: "Buy Token Successfully"})
                        }
                        
                    })
                    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
                }
        
            
            })
            .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
        } else if (balance2 >= amount){
            await Wallets.findOneAndUpdate({owner: req.user.id, wallettype: 'monstergemfarm'}, {$inc: {amount: -amount}})
            .then(async data => {
        
                if(data){
                    await Token.findOne({owner: req.user.id, type: "MCT"})
                    .then(async token => {
                        if(token){
                            const buytoken = {
                                owner: req.user.id,
                                id: customid,
                                type: "MCT",
                                tokenreceive: tokenreceive,
                                amount: amount,
                                transactiontype: transactiontype
                            }
                            
                            const wallet = {
                                owner: req.user.id,
                                type: "Buy MCT Token",
                                description: "Buy MCT Token",
                                amount: amount,
                                historystructure: "mct token buy using monstergemfarm balance"
                            }
        
                            await Token.findOneAndUpdate({owner: req.user.id, type: "MCT"}, {$inc: {amount: tokenreceive}})
                            await Buytokenhistory.create(buytoken)
                            await Wallethistory.create(wallet)
                            await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                            res.json({message: "success", data: "Buy Token Successfully"})
                        } else {
                            const tokenwallet = {
                                owner: req.user.id,
                                type: "MCT",
                                amount: tokenreceive
                            }
        
                            await Token.create(tokenwallet)
        
                            const buytoken = {
                                owner: req.user.id,
                                id: customid,
                                type: "MCT",
                                tokenreceive: tokenreceive,
                                amount: amount,
                                transactiontype: transactiontype
                            }
                            
                            const wallet = {
                                owner: req.user.id,
                                type: "Buy MCT Token",
                                description: "Buy MCT Token",
                                amount: amount,
                                historystructure: "mct token buy using monstergemfarm balance"
                            }
                    
                            await Buytokenhistory.create(buytoken)
                            await Wallethistory.create(wallet)
                            await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                            res.json({message: "success", data: "Buy Token Successfully"})
                        }
                        
                    })
                    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
                }
        
            
            })
            .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
        } else {
            res.json({message: "success", data: "You don't have enough monster gem balance"})
        }
    } else if (transactiontype == "bnb"){
        await Token.findOne({owner: req.user.id, type: "MCT"})
        .then(async token => {
            if(token){
                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MCT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MCT Token",
                    description: "Buy MCT Token (BNB)",
                    amount: amount,
                    historystructure: "mct token buy using bnb balance"
                }
                
                await Token.findOneAndUpdate({owner: req.user.id, type: "MCT"},{$inc:{amount: tokenreceive}})
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            } else {
                const tokenwallet = {
                    owner: req.user.id,
                    type: "MCT",
                    amount: tokenreceive
                }

                await Token.create(tokenwallet)

                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MCT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MCT Token",
                    description: "Buy MCT Token (BNB)",
                    amount: amount,
                    historystructure: "mct token buy using bnb balance"
                }
        
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            }
            
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    } else if (transactiontype == "usdt"){
        await Token.findOne({owner: req.user.id, type: "MCT"})
        .then(async token => {
            if(token){
                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MCT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MCT Token",
                    description: "Buy MCT Token (USDT)",
                    amount: amount,
                    historystructure: "mct token buy using usdt balance"
                }
                
                await Token.findOneAndUpdate({owner: req.user.id, type: "MCT"},{$inc:{amount: tokenreceive}})
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            } else {
                const tokenwallet = {
                    owner: req.user.id,
                    type: "MCT",
                    amount: tokenreceive
                }

                await Token.create(tokenwallet)

                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MCT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MCT Token",
                    description: "Buy MCT Token (USDT)",
                    amount: amount,
                    historystructure: "mct token buy using usdt balance"
                }
        
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            }
            
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    } else if (transactiontype == "busd"){
        await Token.findOne({owner: req.user.id, type: "MCT"})
        .then(async token => {
            if(token){
                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MCT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MCT Token",
                    description: "Buy MCT Token (BUSD)",
                    amount: amount,
                    historystructure: "mct token buy using busd balance"
                }
                
                await Token.findOneAndUpdate({owner: req.user.id, type: "MCT"},{$inc:{amount: tokenreceive}})
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            } else {
                const tokenwallet = {
                    owner: req.user.id,
                    type: "MCT",
                    amount: tokenreceive
                }

                await Token.create(tokenwallet)

                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MCT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MCT Token",
                    description: "Buy MCT Token (BUSD)",
                    amount: amount,
                    historystructure: "mct token buy using busd balance"
                }
        
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            }
            
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    } else if (transactiontype == "usdc"){
        await Token.findOne({owner: req.user.id, type: "MCT"})
        .then(async token => {
            if(token){
                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MCT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MCT Token",
                    description: "Buy MCT Token (USDC)",
                    amount: amount,
                    historystructure: "mct token buy using usdc balance"
                }
                
                await Token.findOneAndUpdate({owner: req.user.id, type: "MCT"},{$inc:{amount: tokenreceive}})
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            } else {
                const tokenwallet = {
                    owner: req.user.id,
                    type: "MCT",
                    amount: tokenreceive
                }

                await Token.create(tokenwallet)

                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MCT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MCT Token",
                    description: "Buy MCT Token (USDC)",
                    amount: amount,
                    historystructure: "mct token buy using usdc balance"
                }
        
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            }
            
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    } else if (transactiontype == "xrp"){
        await Token.findOne({owner: req.user.id, type: "MCT"})
        .then(async token => {
            if(token){
                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MCT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MCT Token",
                    description: "Buy MCT Token (XRP)",
                    amount: amount,
                    historystructure: "mct token buy using xrp balance"
                }
                
                await Token.findOneAndUpdate({owner: req.user.id, type: "MCT"},{$inc:{amount: tokenreceive}})
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            } else {
                const tokenwallet = {
                    owner: req.user.id,
                    type: "MCT",
                    amount: tokenreceive
                }

                await Token.create(tokenwallet)

                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MCT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MCT Token",
                    description: "Buy MCT Token (XRP)",
                    amount: amount,
                    historystructure: "mct token buy using xrp balance"
                }
        
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            }
            
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    } else if (transactiontype == "doge"){
        await Token.findOne({owner: req.user.id, type: "MCT"})
        .then(async token => {
            if(token){
                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MCT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MCT Token",
                    description: "Buy MCT Token (DOGE)",
                    amount: amount,
                    historystructure: "mct token buy using doge balance"
                }
                
                await Token.findOneAndUpdate({owner: req.user.id, type: "MCT"},{$inc:{amount: tokenreceive}})
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            } else {
                const tokenwallet = {
                    owner: req.user.id,
                    type: "MCT",
                    amount: tokenreceive
                }

                await Token.create(tokenwallet)

                const buytoken = {
                    owner: req.user.id,
                    id: customid,
                    type: "MCT",
                    tokenreceive: tokenreceive,
                    amount: amount,
                    transactiontype: transactiontype
                }
                
                const wallet = {
                    owner: req.user.id,
                    type: "Buy MCT Token",
                    description: "Buy MCT Token (DOGE)",
                    amount: amount,
                    historystructure: "mct token buy using doge balance"
                }
        
                await Buytokenhistory.create(buytoken)
                await Wallethistory.create(wallet)
                await Communityactivity.findOneAndUpdate({type: "mcttoken"},{$inc: {amount: amount}})
                res.json({message: "success", data: "Buy Token Successfully"})
            }
            
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    } 

}

exports.mytoken = (req,res) => {

    Token.find({owner: req.user.id})
    .sort({createdAt: -1})
    .then(data => {
        const mct = data.find(e => e.type == "MCT")
        const mmt = data.find(e => e.type == "MMT")

        res.json({message: "success", data: mmt?.amount, data2: mct?.amount})
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.mytokenbuyhistory = (req,res) => {
    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    };

    Buytokenhistory.find({owner: req.user.id})
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .sort({createdAt: -1})
    .then(data => {
        Buytokenhistory.countDocuments({owner: req.user.id})
        .then(count => {
            const totalPages = Math.ceil(count / pageOptions.limit)
            res.json({ message: "success", data: data, pages: totalPages })
        })
        .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.tokenwithdrawhistory = (req, res) => {
    const { claimedAt, hash, gasfeehash} = req.body

    const withdrawtransaction = {
        mmthash: hash,
        claimedAt: claimedAt,
        status: "success"
    }

    TokenTransactions.findOneAndUpdate({gasfeehash: gasfeehash}, withdrawtransaction)
    .then(data => {
        if(data){
            res.json({message: "success"})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.createwithdrawhistory = (req,res) => {
    const { amount , token, walletaddress, gasfeehash } = req.body

    const createhistory = {
        owner: req.user.id,
        wallet: walletaddress,
        gasfeehash: gasfeehash,
        type: token,
        amount: amount,
        status: "processing"
    }

    TokenTransactions.create(createhistory)
    .then(data => {
        if(data){
            res.json({message: "success"})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.withdrawtoken = (req, res) => {
    const { amount , token } = req.body

    Token.findOne({owner: req.user.id, type: token})
    .then(async tokens => {
        if(tokens){
            if(amount > tokens.amount){
                res.json({message: "failed", data: "You don't have enough balance"})
                return
            }

            await Token.findOneAndUpdate({owner: req.user.id, type: token},{$inc: {amount: -amount}})
            .then(data => {
                if(data){
                    res.json({message: "success"})
                }
            })
            .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
        } else {
            res.json({message: "failed", data: "Token wallet not found"})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
}

exports.buysubscription = async (req, res) => {
    const { id } = req.user
    const { substype } = req.body

    const maintenance = await checkmaintenance("maintenancesubscription")

    if (maintenance == "1") {
        return res.json({message: "maintenance"})
    }

    if (substype != "Pearlplus" && substype != "Ruby" && substype != "Emerald" && substype != "Diamond"){
        return res.json({message: "subsnotexist"})
    }

    let subsamount = getsubsamount(substype);

    if (subsamount <= 0){
        return res.json({message: "subsamountiszero"})
    }

    const pooldetails = await getpooldetails(id)

    if (pooldetails == "bad-request"){
        return res.status(400).json({ message: "bad-request" })
    }

    if (pooldetails == "erroraccount"){
        return res.json({ message: "erroraccount" })
    }

    const previoussubs = getsubsamount(pooldetails.subscription)

    if (substype == pooldetails.subscription){
        return res.json({message: "samesubs"})
    }
    
    const finalsubsamount = subsamount - previoussubs

    const checkwallet = await checkwalletamount(finalsubsamount, id)

    if (checkwallet == "notexist"){
        return res.json({message: "walletnotexist"})
    }

    if (checkwallet == "notenoughfunds"){
        return res.json({message: "notenoughfunds"})
    }

    if (checkwallet == "bad-request"){
        return res.status(400).json({ message: "bad-request" })
    }

    const sendcoms = await sendcommissiontounilevel(finalsubsamount, id, substype);
    
    if (sendcoms == "bad-request"){
        console.log("fck")
        await addwalletamount(id, "balance", finalsubsamount)

        return res.status(400).json({ message: "bad-request" })
    }

    if (sendcoms == "success"){
        await Pooldetails.findOneAndUpdate({owner: new mongoose.Types.ObjectId(id)}, [
            {
                $set: {
                    subscription: substype,
                    status: {
                        $cond: {
                            if: {
                                $eq: [substype, "Diamond"]
                            },
                            then: "Active",
                            else: "Inactive"
                        }
                    },
                    rank: "none"
                }
            }
        ])
        .then(async () => {
            const complan = await computecomplan(finalsubsamount)

            if (complan != "success"){
                return res.status(400).json({ message: "bad-request" })
            }

            const walletamount = await getwalletamount(id, "monstercoin")

            if (!walletamount){
                return res.json({message: "nowallet"})
            }

            const addtotalmc = await addtototalfarmmc(walletamount.amount, 0)

            if (addtotalmc.message != "success"){
                return res.json({message: "failed"})
            }

            await SubsAccumulated.findOneAndUpdate({subsname: substype.toLowerCase()}, {$inc: {amount: finalsubsamount}})
            .then(async () => {
                const analyticsadd = await addanalytics(id, `Buy Subscription (${substype})`, finalsubsamount)

                if (analyticsadd == "bad-request"){
                    return res.status(400).json({ message: "bad-requestasdfasd" })
                }

                if(pooldetails.subscription != "Pearl"){
                    return res.json({message: "success"})
                } else {
                    let tokentoreceive;
                    switch(substype){
                        case "Pearlplus":
                            tokentoreceive = 100;
                        case "Ruby":
                            tokentoreceive = 200;
                        case "Emerald":
                            tokentoreceive = 500;
                        case "Diamond":
                            tokentoreceive = 1000;
                        default:
                    }

                    const airdroplimit = await checkairdroplimit((tokentoreceive * 2), "MMT")
                    const directreferralid = await Gameusers.findOne({_id: new mongoose.Types.ObjectId(id)}).then(e => e.referral)
                    if(airdroplimit == "bad-request"){
                        return res.status(400).json({ message: "bad-request" })
                    }

                    if(airdroplimit == 'notlimit'){
                        const addmmt = await addtoken(id, substype)

                        if(addmmt == "bad-request"){
                            return res.status(400).json({ message: "bad-request" })
                        }

                        if(addmmt == 'success'){
                            const addmmttoreferal = await addtoken(directreferralid, substype)

                            if(addmmttoreferal == "bad-request"){
                                return res.status(400).json({ message: "bad-request" })
                            }

                            return res.json({message: "success"})
                        }
                    } else {
                        return res.json({message: "success"})
                    }
                }

                
            })
            .catch(err => res.status(400).json({ message: "bad-request whaat", data: err.message }))
        })
        .catch(err => res.status(400).json({ message: "bad-request shiiit", data: err.message }))
    }
    else{
        await addwalletamount(id, "balance", finalsubsamount)
        return res.json({message: "failed"})
    }

}

exports.totaltokens = (req, res) => {
    Buytokenhistory.find()
    .then(tokens => {
        // Filter tokens based on type
        const MMTTokens = tokens.filter(e => e.type === "MMT");
        const MCTTokens = tokens.filter(e => e.type === "MCT");

        // Calculate sum of amounts for each type
        const sumMMT = MMTTokens.reduce((acc, token) => acc + token.tokenreceive, 0);
        const sumMCT = MCTTokens.reduce((acc, token) => acc + token.tokenreceive, 0);

        res.json({ message: "success", data: sumMMT, data2: sumMCT });
    })
    .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
};

exports.deposittoken = (req, res) => {
    const { token, amount, hash, walletaddress, depositAt } = req.body
    Token.findOne({owner: req.user.id, type: token})
    .then(async data => {
        if(data){

            const deposithistory = {
                owner: req.user.id,
                wallet: walletaddress,
                mmthash: hash,
                amount: amount,
                type: token,
                depositAt: depositAt
            }
            await TokenTransactions.create(deposithistory)
            .catch((error) => res.status(500).json({ message: "failed", error: error.message }));

            await Token.findOneAndUpdate({owner: req.user.id, type: token},{$inc: {amount: parseFloat(amount)}})
            .catch((error) => res.status(500).json({ message: "failed", error: error.message }));

            res.json({message: "success"})
        } else {
            const createtokenwallet = {
                owner: req.user.id,
                type: token,
                amount: amount
            }

            await Token.create(createtokenwallet)
            .catch((error) => res.status(500).json({ message: "failed", error: error.message }));

            const deposithistory = {
                owner: req.user.id,
                wallet: walletaddress,
                hash: hash,
                amount: parseFloat(amount),
                type: token,
                depositAt: depositAt
            }

            await TokenTransactions.create(deposithistory)
            .catch((error) => res.status(500).json({ message: "failed", error: error.message }));

            res.json({message: "success"})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
}

exports.mydeposittokenhistory = (req, res) => {
    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    };

    TokenTransactions.find({owner: req.user.id, depositAt: { $ne: null, $ne: "", $exists: true }})
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .sort({createdAt: -1})
    .then(data => {
        TokenTransactions.countDocuments({owner: req.user.id, depositAt: { $ne: null, $ne: "", $exists: true }})
        .then(count => {
            const totalPages = Math.ceil(count / pageOptions.limit)
            res.json({ message: "success", data: data, pages: totalPages })
        })
        .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
    })
    .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
}

exports.mywithdrawaltokenhistory = (req, res) => {
    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    };

    TokenTransactions.find({owner: req.user.id, claimedAt: { $ne: null, $ne: "", $exists: true }})
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .sort({createdAt: -1})
    .then(data => {
        TokenTransactions.countDocuments({owner: req.user.id, claimedAt: { $ne: null, $ne: "", $exists: true }})
        .then(count => {
            const totalPages = Math.ceil(count / pageOptions.limit)
            res.json({ message: "success", data: data, pages: totalPages })
        })
        .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
    })
    .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
}

exports.ifwithdrawerror = (req, res) => {
    const { amount, token } = req.body

    Token.findOne({owner: req.user.id, type: token})
    .then(async tokens => {
        if(tokens){
            
            await Token.findOneAndUpdate({owner: req.user.id, type: token},{$inc: {amount: +amount}})
            .then(data => {
                if(data){
                    res.json({message: "success"})
                }
            })
            .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
        } else {
            res.json({message: "failed", data: "Token wallet not found"})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
}

exports.acceptairdropquest = (req, res) => {
    const {
        questid,
        questtitle,
        mmttokenreward,
        mcttokenreward,
        acceptAt,
        expiredAt,
    } = req.body


    const quest = {
        owner: req.user.id,
        questid: questid,
        questtitle: questtitle,
        mmttokenreward: mmttokenreward,
        mcttokenreward: mcttokenreward,
        acceptAt: acceptAt,
        expiredAt: expiredAt,
    }

    Airdropquest.create(quest)
    .then(data => {
        if(data){
            res.json({message: "success", data: "Quest Accepted"})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed", error: error.message }));

}

exports.findquest = async (req, res) => {

    Airdropquest.find({owner: req.user.id})
    .then(async data => {
        if(data){
            const quest1 = data.find(e => e.questid == 1)
            const quest2 = data.find(e => e.questid == 2)
            const claimablequest = {}
            if(quest1){
                const accountstatus = await Gameusers.findOne({_id: req.user.id}).then(e => e.playstatus)
    
                if(accountstatus == "active"){
                    claimablequest.Quest1 = "claimable";
                } else {
                    claimablequest.Quest1 = "notclaimable";
                }

                res.json({message: "success", data: data, data2: claimablequest})
            } else if (quest2) {
                const directpoints = await WalletsCutoff.findOne({_id: req.user.id, wallettype: "wallettype"}).then(e => e.amount)

                if(directpoints >= 20){
                    claimablequest.Quest2 = "claimable";
                } else {
                    claimablequest.Quest2 = "notclaimable";
                }

                res.json({message: "success", data: data, data2: claimablequest})

            } else {
                res.json({message: "success", data: "noquest"})
            }
        } else {
            res.json({message: "success", data: "noquest"})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
}

exports.claimairdropquest = (req, res) => {
    const {questid, claimedAt} = req.body

    Airdropquest.findOne({owner: req.user.id, questid: questid})
    .then(async data => {
        if(data){

            const airdrophistory = {
                owner: req.user.id,
                questid: questid,
                questtitle: data.questtitle,
                mmttokenreward: data.mmttokenreward,
                mcttokenreward: data.mcttokenreward,
                acceptAt: data.acceptAt,
                expiredAt: data.expiredAt,
                claimedAt: claimedAt
            }
            if(data.mmttokenreward != null || data.mmttokenreward != undefined){
                await Token.findOne({owner: data.owner, type: "MMT"})
                .then(async data1 => {
                    if(data1){
                        await Token.findOneAndUpdate({owner: data.owner, type: "MMT"}, {$inc: {amount: data.mmttokenreward}})
                    } else {
                        const createtokenwallet = {
                            owner: data.owner,
                            type: "MMT",
                            amount: data.mmttokenreward
                        }
            
                        await Token.create(createtokenwallet)
                    }
                    
                })
                
            }

            if(data.mcttokenreward != null || data.mcttokenreward != undefined){
                await Token.findOne({owner: data.owner, type: "MCT"})
                .then(async data1 => {
                    if(data1){
                        await Token.findOneAndUpdate({owner: data.owner, type: "MCT"}, {$inc: {amount: data.mcttokenreward}})
                    } else {
                        const createtokenwallet = {
                            owner: data.owner,
                            type: "MCT",
                            amount: data.mcttokenreward
                        }
            
                        await Token.create(createtokenwallet)
                    }
                    
                })
            }

            await Airdropquest.findOneAndUpdate({owner: req.user.id, questid: questid}, {claimedAt: claimedAt})
            await Airdroptransaction.create(airdrophistory)
            res.json({message: "success"})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
}

exports.totalairdrop = (req, res) => {
    Airdroptransaction.find()
    .then(tokens => {
        // Filter tokens based on type
        const MMTTokens = tokens.filter(e => e.mmttokenreward);
        const MCTTokens = tokens.filter(e => e.mcttokenreward);

        // Calculate sum of amounts for each type
        const sumMMT = MMTTokens.reduce((acc, token) => acc + token.mmttokenreward, 0);
        const sumMCT = MCTTokens.reduce((acc, token) => acc + token.mcttokenreward, 0);

        res.json({ message: "success", data: sumMMT, data2: sumMCT });
    })
    .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
}