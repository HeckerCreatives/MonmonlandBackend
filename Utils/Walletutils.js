const { default: mongoose } = require("mongoose")
const Gamewallet = require("../Gamemodels/Wallets")
const Gameusers = require("../Gamemodels/Gameusers")
const Wallethistory = require("../Gamemodels/Wallethistory")
const Ingameleaderboard = require("../Gamemodels/Leaderboard")
const Communityactivity = require("../Models/Communityactivity")
const Buytokenhistory = require("../Gamemodels/Buytokenhistory")
const Token = require("../Gamemodels/Token")
const { setleaderboard } = require("../Utils/Leaderboards")
const Airdroptransaction = require("../Gamemodels/Airdroptransaction")
const Walletscutoff = require("../Gamemodels/Walletscutoff")
exports.checkwalletamount = async (amount, id) => {
    return await Gamewallet.findOne({owner: new mongoose.Types.ObjectId(id), wallettype: "balance"})
    .then(async data => {
        if (!data){
            return "notexist"
        }

        if (data.amount < amount){
            return "notenoughfunds"
        }

        await Gamewallet.findOneAndUpdate({owner: new mongoose.Types.ObjectId(id), wallettype: "balance"}, [{
            $set: {
                amount: {
                    $max: [0, {
                        $add: ["$amount", -amount]
                    }]
                }
            }
        }]).then(() => {
            return "success"
        })
        .catch(err => "bad-request")
    })
    .catch(err => "bad-request")
}

exports.getwalletamount = async (id, type) => {
    return await Gamewallet.findOne({owner: new mongoose.Types.ObjectId(id), wallettype: type})
    .then(data => data)
    .catch(err => "bad-request")
}

exports.sendcommissiontounilevel = async(commissionAmount, id, substype) => {
    let response = ""
    await Gameusers.findOne({_id: id})
    .then(async sender => {

        const pipeline = [
            // Match the sender
            {
                $match: { _id: sender._id },
            },
            // GraphLookup to recursively traverse the referral chain
            {
                $graphLookup: {
                    from: 'gameusers',
                    startWith: '$referral',
                    connectFromField: 'referral',
                    connectToField: '_id',
                    as: 'referralChain',
                    maxDepth: 9, // Set the maximum depth to your needs
                    depthField: 'level',
                },
            },
            // Project to check the referral chain after the $graphLookup stage
            {
                $project: {
                    _id: 1,
                    referralChain: '$referralChain',
                },
            },
            // Unwind the referral chain array
            {
                $unwind: '$referralChain',
            },
            // Project to check the fields after the $unwind stage
            {
                $project: {
                    _id: '$referralChain._id',
                    level: '$referralChain.level',
                    originalCommissionPercentage: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$referralChain.level', 0] }, then: { $cond: {
                                            if: { $eq: ['$referralChain._id', new mongoose.Types.ObjectId(process.env.MONMONLAND_ID)]},
                                            then: {
                                                $multiply: [commissionAmount, 0.40]
                                            },
                                            else : {
                                                $multiply: [commissionAmount, 0.15]
                                            }
                                        } 
                                    }
                                },
                                { case: { $eq: ['$referralChain.level', 1] }, then: { $cond: {
                                            if: { $eq: ['$referralChain._id', new mongoose.Types.ObjectId(process.env.MONMONLAND_ID)]},
                                            then: {
                                                $multiply: [commissionAmount, 0.25]
                                            },
                                            else : {
                                                $multiply: [commissionAmount, 0.07]
                                            }
                                        } 
                                    }
                                },
                                { case: { $eq: ['$referralChain.level', 2] }, then: { $cond: {
                                            if: { $eq: ['$referralChain._id', new mongoose.Types.ObjectId(process.env.MONMONLAND_ID)]},
                                            then: {
                                                $multiply: [commissionAmount, 0.18]
                                            },
                                            else : {
                                                $multiply: [commissionAmount, 0.05]
                                            }
                                        } 
                                    }
                                },
                                { case: { $eq: ['$referralChain.level', 3] }, then: { $cond: {
                                            if: { $eq: ['$referralChain._id', new mongoose.Types.ObjectId(process.env.MONMONLAND_ID)]},
                                            then: {
                                                $multiply: [commissionAmount, 0.13]
                                            },
                                            else : {
                                                $multiply: [commissionAmount, 0.04]
                                            }
                                        } 
                                    }
                                },
                                { case: { $eq: ['$referralChain.level', 4] }, then: { $cond: {
                                            if: { $eq: ['$referralChain._id', new mongoose.Types.ObjectId(process.env.MONMONLAND_ID)]},
                                            then: {
                                                $multiply: [commissionAmount, 0.09]
                                            },
                                            else : {
                                                $multiply: [commissionAmount, 0.03]
                                            }
                                        } 
                                    }
                                },
                                { case: { $eq: ['$referralChain.level', 5] }, then: { $cond: {
                                            if: { $eq: ['$referralChain._id', new mongoose.Types.ObjectId(process.env.MONMONLAND_ID)]},
                                            then: {
                                                $multiply: [commissionAmount, 0.06]
                                            },
                                            else : {
                                                $multiply: [commissionAmount, 0.02]
                                            }
                                        } 
                                    }
                                },
                                { case: { $eq: ['$referralChain.level', 6] }, then: { $cond: {
                                            if: { $eq: ['$referralChain._id', new mongoose.Types.ObjectId(process.env.MONMONLAND_ID)]},
                                            then: {
                                                $multiply: [commissionAmount, 0.04]
                                            },
                                            else : {
                                                $multiply: [commissionAmount, 0.01]
                                            }
                                        } 
                                    }
                                },
                                { case: { $eq: ['$referralChain.level', 7] }, then: { $cond: {
                                            if: { $eq: ['$referralChain._id', new mongoose.Types.ObjectId(process.env.MONMONLAND_ID)]},
                                            then: {
                                                $multiply: [commissionAmount, 0.03]
                                            },
                                            else : {
                                                $multiply: [commissionAmount, 0.01]
                                            }
                                        } 
                                    }
                                },
                                { case: { $eq: ['$referralChain.level', 8] }, then: { $cond: {
                                            if: { $eq: ['$referralChain._id', new mongoose.Types.ObjectId(process.env.MONMONLAND_ID)]},
                                            then: {
                                                $multiply: [commissionAmount, 0.02]
                                            },
                                            else : {
                                                $multiply: [commissionAmount, 0.01]
                                            }
                                        } 
                                    }
                                },
                                { case: { $eq: ['$referralChain.level', 9] }, then: { $multiply: [commissionAmount, 0.01] } },
                            ],
                            default: 0,
                        },
                    },
                },
            },
            // Group to calculate the total commissionPercentage for each level
            {
                $group: {
                    _id: '$_id',
                    level: {$first: '$level'},
                    amount: { $sum: '$originalCommissionPercentage' },
                },
            },
        ];
        
        const unilevelresult = await Gameusers.aggregate(pipeline)
        .catch(err => console.log(err.message));

        const historypipeline = []

        let directreferralid = ""

        unilevelresult.forEach(dataresult => {
            const { _id, level, amount } = dataresult

            if (level == 0){
                directreferralid = _id
            }

            historypipeline.push({owner: new mongoose.Types.ObjectId(_id), type: "Subscription Unilevel", description: "Subscription Unilevel", amount: amount, historystructure: `from userid: ${id} with amount of ${commissionAmount}`})
        })

        const bulkOperationUnilvl = unilevelresult.map(({_id, amount }) => ({
            updateOne: {
                filter: { owner: _id, wallettype: 'balance' },
                update: { $inc: { amount: amount}}
            }
        }))

        //  DIRECT POINTS
        if (directreferralid != process.env.MONMONLAND_ID && directreferralid != ""){

            let pointsamount = 0;

            switch(substype){
                case "Pearl":
                    pointsamount = 0
                    break;
                case "Ruby":
                    pointsamount = 2
                    break;
                case "Emerald":
                    pointsamount = 6
                    break;
                case "Diamond":
                    pointsamount = 10
                    break;
                default:
                    pointsamount = 0
                    break;
            }
            
            await Gamewallet.findOneAndUpdate({owner: new mongoose.Types.ObjectId(directreferralid), wallettype: "directpoints"}, {$inc: {amount: pointsamount}})
            .catch(err => {
                return "bad-request"
            })

            await Walletscutoff.findOneAndUpdate({owner: new mongoose.Types.ObjectId(directreferralid), wallettype: "directpoints"}, {$inc: {amount: pointsamount}})
            .catch(err => {
                return "bad-request"
            })

            const addleaderboard = await setleaderboard(directreferralid, pointsamount)

            if (addleaderboard != "success"){
                console.log("damn2")
                response = "bad-request"

                return;
            }
        }

        await Gamewallet.bulkWrite(bulkOperationUnilvl)
        .catch(err => {
            console.log(err.message)
            response = "bad-request"
        })
        await Wallethistory.insertMany(historypipeline)
        .catch(err => {
            console.log(err.message)
            response = "bad-request"
        })

        response = "success"
    })
    .catch(err => {
        console.log(err.message)
        response = "bad-request"
    })

    return response;
}

exports.addwalletamount = async (id, wallettype, amount) => {
    return await Gamewallet.findOneAndUpdate({owner: new mongoose.Types.ObjectId(id), wallettype: wallettype}, {$inc: {amount: amount}})
    .then(() => "success")
    .catch(err => {
        console.log(err.message, "addwallet amount failed")
        return "bad-request"
    })
}

exports.checktokenlimit = async (tokentoreceive, tokentype) => {
    return await Buytokenhistory.find()
    .then(tokens => {
        // Filter tokens based on type
        const MMTTokens = tokens.filter(e => e.type === "MMT");
        const MCTTokens = tokens.filter(e => e.type === "MCT");

        // Calculate sum of amounts for each type
        const sumMMT = MMTTokens.reduce((acc, token) => acc + token.tokenreceive, 0);
        const sumMCT = MCTTokens.reduce((acc, token) => acc + token.tokenreceive, 0);

        if(tokentype == "MMT"){
            const tokentobeadd = parseFloat(sumMMT) + parseFloat(tokentoreceive)
            const limit = 20000000

            if(tokentobeadd > limit){
                return true
            } else {
                return false
            }
        } else if (tokentype == "MCT"){
            const tokentobeadd = parseFloat(sumMCT) + parseFloat(tokentoreceive)
            const limit = 50000000
            if(tokentobeadd > limit){
                return true
            } else {
                return false
            }
        } else {
            return "token type not found"
        }
    })
    .catch((error) => `error ${error}`);
}

exports.addtoken = async (id, substype) => {
    let tokentoreceive = 0;
    switch(substype){
        case "Pearlplus":
            tokentoreceive = 100;
        break;
        case "Ruby":
            tokentoreceive = 200;
        break;
        case "Emerald":
            tokentoreceive = 500;
        break;
        case "Diamond":
            tokentoreceive = 1000;
        break;
        default:
        break;
    }
    

    return await Token.findOne({owner: id})
    .then(async token => {
        if(token){

            const history = {
                owner: id,
                type: "Subscription incentive MMT Token",
                description: "Subscription incentive MMT Token",
                amount: tokentoreceive,
                historystructure: "mmt token subscription incentive"
            }

            const airdrophistory = {
                owner: id,
                // questid: questid,
                questtitle: "Subscription Incentive",
                mmttokenreward: tokentoreceive,
                mcttokenreward: 0,
            }

            await Token.findOneAndUpdate({owner: id, type: "MMT"},{$inc: {amount: tokentoreceive}})
            await Wallethistory.create(history)
            await Airdroptransaction.create(airdrophistory)
            return 'success'
        } else {
            const createwallet = {
                owner: id,
                type: "MMT",
                amount: tokentoreceive
            }

            const history = {
                owner: id,
                type: "Subscription incentive MMT Token",
                description: "Subscription incentive MMT Token",
                amount: tokentoreceive,
                historystructure: "mmt token subscription incentive"
            }

            const airdrophistory = {
                owner: id,
                type: "MMT",
                tokereward: tokentoreceive
            }

            await Token.create(createwallet)
            await Wallethistory.create(history)
            await Airdroptransaction.create(airdrophistory)
            return 'success'
        }
    })
    .catch(err => {
        console.log(err.message, "addtoken amount failed")
        return "bad-request"
    })
}

exports.checkairdroplimit = async (tokentoreceive, tokentype) => {

    return await Airdroptransaction.find()
    .then(tokens => {
        const MMTTokens = tokens.filter(e => e.type === "MMT");
        const MCTTokens = tokens.filter(e => e.type === "MCT");

        const sumMMT = MMTTokens.reduce((acc, token) => acc + token.mmttokenreward, 0);
        const sumMCT = MCTTokens.reduce((acc, token) => acc + token.mcttokenreward, 0);

        if(tokentype == "MMT"){
            const tokentobeadd = sumMMT + parseFloat(tokentoreceive)
            const limit = 1000000

            if(tokentobeadd > limit){
                return 'limit'
            } else {
                return 'notlimit'
            }
        } else if (tokentype == "MCT"){
            const tokentobeadd = sumMCT + parseFloat(tokentoreceive)
            const limit = 10000000

            if(tokentobeadd > limit){
                return 'limit'
            } else {
                return 'notlimit'
            }

        } else {
            return "token not found"
        }

    })
    .catch(err => {
        console.log(err.message, "checkairdroplimit failed")
        return "bad-request"
    })
}