const Communityactivity = require("../Models/Communityactivity")
const Monmoncoin = require("../Models/Monmoncoin")
const Gameactivity = require("../Models/Gameactivity")
const Mchistory = require("../Models/Mcconversionhistory")

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
                    console.log(grind)
                    res.json({message: "success", data: fnal})
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

    const summary = {
        "leaderboard": leaderboard,
        "grinding": grinding,
        "quest": quest
    }

    res.json({message: "success", data: summary})
    
}