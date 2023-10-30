const SubsAccumulated = require("../Models/SubsAccumulated")
const SubscriptionUser = require ("../Models/SubscriptionUser")
const Monmoncoin = require("../Models/Monmoncoin")
const Communityactivity = require("../Models/Communityactivity")
const Gameactivity = require("../Models/Gameactivity")
exports.create = (req, res) => {

    const data = [
        {  
            _id: "629a98a5a881575c013b5350",
            subsname: "pearl",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5351",
            subsname: "ruby",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5352",
            subsname: "emerald",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5353",
            subsname: "diamond",
            amount: 0
        },
    ]

    SubsAccumulated.create(data)
    res.json("subsaccumulated created")
}

exports.update = (req, res) => {
    const {subsname, amount, playfabid,} = req.body;
    SubsAccumulated.findOneAndUpdate({subsname: subsname}, {$inc: {amount: amount}})
    .then(data1 => {
        SubscriptionUser.findOneAndUpdate({playfabid: playfabid}, {name: subsname}, {new: true})
        .then(async data2 => {
            let total = 0
            await SubsAccumulated.find()
            .then(data => {
                data.forEach(element => {
                    total += element.amount;
                });
            })
            
            const leaderboards = total * 0.05
            const grinding = total * 0.08
            const quest= total * 0.04

            await Communityactivity.findByIdAndUpdate(process.env.leaderboardsca,{amount: leaderboards})
            await Communityactivity.findByIdAndUpdate(process.env.grindingca,{amount: grinding})
            await Communityactivity.findByIdAndUpdate(process.env.questca,{amount: quest})

            res.json({message: "success"})
        })
        .catch((error) => response.status(500).json({ error: error.message }));
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}

exports.find = (req,res) => {
    const {subsname} = req.body;
    SubsAccumulated.findOne({subsname: subsname})
    .then(data => {
        res.json({message: "success", data: data.amount})
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}

exports.findtotal = (req, res) => {

    SubsAccumulated.find()
    .then(data => {
        let total = 0
        data.forEach(element => {
            total += element.amount;
        });
        Monmoncoin.findOne({name: "Monster Coin"})
        .then(async (mc) => {
            await Gameactivity.findOne()
            .then(header => {
                let grinding = total * 0.08
                let quest = total * 0.04
                let headeramount = header.total

                let totalIncome = quest + grinding + headeramount
                let mcValue = totalIncome / mc.amount;
    
                let finalData = {
                    "totalIncome": totalIncome,
                    "totalMC": mc.amount,
                    "mcValue": mcValue
                }
                res.json({message: "success", data: finalData})
            })
            
        })
        .catch(error => response.status(400).json({ error: error.message }));
    })
    .catch((error) => res.status(500).json({ error: error.message }));

}