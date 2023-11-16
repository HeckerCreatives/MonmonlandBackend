const Communityactivity = require("../Models/Communityactivity")
const Monmoncoin = require("../Models/Monmoncoin")
const Gameactivity = require("../Models/Gameactivity")
const Mchistory = require("../Models/Mcconversionhistory")
const Communityactivityaccumulated = require("../Models/Communityactivyaccumulated")
const Merchandise = require("../Models/Merchandise")
exports.mcvalue = (req, res) => {

    Monmoncoin.findOne({name: "Monster Coin"})
    .then(async mc => {

       await Gameactivity.findOne()
       .then( header => {
            Communityactivity.findOne({type: "grinding"})
            .then(grind => {
                Communityactivity.findOne({type: "quest"})
                .then(quest => {
                    const value = grind.amount + quest.amount + header.total
                    const fnal = value / mc.amount
                    
                    res.json({message: "success", data: fnal, totalmc: mc.amount, totalincome: value})
                })
                .catch((error) => res.status(500).json({ error: error.message }));
            })
            .catch((error) => res.status(500).json({ error: error.message }));
       })
       .catch((error) => res.status(500).json({ error: error.message }));

    })
    .catch((error) => res.status(500).json({ error: error.message }));
}

exports.resetmonthly = (req, res) => {
    const { mcvalue } = req.body

    Monmoncoin.findOne({name: "Monster Coin"})
    .then(async mc => {
        Monmoncoin.findByIdAndUpdate(mc._id, {amount: 0})
        .then(async mcreset => {

            if(mcreset){
                const leaderboard =  await Communityactivity.findOne({_id: process.env.leaderboardsca})
                .then(data => {
                    return data.amount
                })

                const grinding =   await Communityactivity.findOne({_id: process.env.grindingca})
                .then(data => {
                    return data.amount
                })
                const quest =  await Communityactivity.findOne({_id: process.env.questca})
                .then(data => {
                    return data.amount
                })
                
                // await Communityactivityaccumulated.findByIdAndUpdate(process.env.communityaccumulated, {$inc: {leaderboardamount: leaderboard, grindingamount: grinding, questamount: quest}})

                const history = {
                    amount: mcvalue,
                    leaderboardamount: leaderboard,
                    grindingamount: grinding,
                    questamount: quest,
                }

                await Mchistory.create(history)

                await Communityactivity.findByIdAndUpdate(process.env.leaderboardsca,{amount: 0})
                await Communityactivity.findByIdAndUpdate(process.env.grindingca,{amount: 0})
                await Communityactivity.findByIdAndUpdate(process.env.questca,{amount: 0})

                res.json({message: "success"})
            }
            
        })
        .catch((error) => res.status(500).json({ error: error.message }));

    })
    .catch((error) => res.status(500).json({ error: error.message }));
}

exports.mcvaluemonthly = (req, res) => {
    Mchistory.findOne()
    .sort({ createdAt: -1 })
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}

exports.find = async (req, res) => {
    const leaderboard =  await Communityactivity.findOne({_id: process.env.leaderboardsca})
    .then(data => {
        return data.amount
    })
    .catch((error) => res.status(500).json({ error: error.message }));

    const grinding =   await Communityactivity.findOne({_id: process.env.grindingca})
    .then(data => {
        return data.amount
    })
    .catch((error) => res.status(500).json({ error: error.message }));

    const quest =  await Communityactivity.findOne({_id: process.env.questca})
    .then(data => {
        return data.amount
    })
    .catch((error) => res.status(500).json({ error: error.message }));

    const diamondpools = await Communityactivity.findOne({_id: process.env.diamondpoolsca})
    .then(data => {
        return data.amount
    })
    .catch((error) => res.status(500).json({ error: error.message }));

    const devsshare = await Communityactivity.findOne({_id: process.env.devsshareca})
    .then(data => {
        return data.amount
    })
    .catch((error) => res.status(500).json({ error: error.message }));

    const companyshare = await Communityactivity.findOne({_id: process.env.companyshareca})
    .then(data => {
        return data.amount
    })
    .catch((error) => res.status(500).json({ error: error.message }));

    const officers = await Communityactivity.findOne({_id: process.env.officersca})
    .then(data => {
        return data.amount
    })
    .catch((error) => res.status(500).json({ error: error.message }));

    const marketing = await Communityactivity.findOne({_id: process.env.marketingca})
    .then(data => {
        return data.amount
    })
    .catch((error) => res.status(500).json({ error: error.message }));

    const incentives = await Communityactivity.findOne({_id: process.env.incentivesca})
    .then(data => {
        return data.amount
    })
    .catch((error) => res.status(500).json({ error: error.message }));

    const summary = {
        "leaderboard": leaderboard,
        "grinding": grinding,
        "quest": quest,
        "diamondpools": diamondpools,
        "devsshare": devsshare,
        "companyshare": companyshare,
        "officers": officers,
        "marketing": marketing,
        "incentives": incentives
    }

    res.json({message: "success", data: summary})
    
}

exports.unilevelmonstergem = (req, res) => {
    const { amount } = req.body;

    Communityactivity.findOneAndUpdate({type: "unilevelmonstergem"}, {$inc: {amount: amount}})
    .then((data) => {
        if(data){
            res.json({message: "success"})
        }
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}