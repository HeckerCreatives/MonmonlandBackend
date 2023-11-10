const SubsAccumulated = require("../Models/SubsAccumulated")
const SubscriptionUser = require ("../Models/SubscriptionUser")
const Monmoncoin = require("../Models/Monmoncoin")
const Communityactivity = require("../Models/Communityactivity")
const Gameactivity = require("../Models/Gameactivity")
const Communityactivityaccumulated = require("../Models/Communityactivyaccumulated")

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
            let totalaccu = 0;

            await SubsAccumulated.find()
            .then(data => {
                data.forEach(element => {
                    total += element.amount;
                });
            })

            await Communityactivityaccumulated.findOne({})
            .then(async data => {
                
                // const leaderboards = (total * 0.05) - data.leaderboardamount
                // const grinding = (total * 0.08) - data.grindingamount
                // const quest = (total * 0.04) - data.questamount
                
                const leaderboards = (amount * 0.02)
                const grinding = (amount * 0.12)
                const quest = (amount * 0.05)
                const diamondpools = (amount * 0.01)
                const devsshare = (amount * 0.05)
                const companyshare = (amount * 0.05)
                const officers = (amount * 0.40)
                const marketing = (amount * 0.03)
                const incentives = (amount * 0.02)

                await Communityactivity.findByIdAndUpdate(process.env.leaderboardsca, {$inc: {amount: leaderboards}})
                await Communityactivity.findByIdAndUpdate(process.env.grindingca, {$inc: {amount: grinding}} )
                await Communityactivity.findByIdAndUpdate(process.env.questca, {$inc: {amount: quest}})
                await Communityactivity.findByIdAndUpdate(process.env.diamondpoolsca, {$inc: {amount: diamondpools}})
                await Communityactivity.findByIdAndUpdate(process.env.devsshareca, {$inc: {amount: devsshare}})
                await Communityactivity.findByIdAndUpdate(process.env.companyshareca, {$inc: {amount: companyshare}})
                await Communityactivity.findByIdAndUpdate(process.env.officersca, {$inc: {amount: officers}})
                await Communityactivity.findByIdAndUpdate(process.env.marketingca, {$inc: {amount: marketing}})
                await Communityactivity.findByIdAndUpdate(process.env.incentivesca, {$inc: {amount: incentives}})



                res.json({message: "success"})

            })
        })
        .catch((error) => res.status(500).json({ error: error.message }));
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
                // let diamondpool = total * 0.03
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

exports.totalsubsaccu = (req, res) => {
    SubsAccumulated.find()
    .then(data => {
        let total = 0
        data.forEach(element => {
            total += element.amount;
        });
        res.json({message: "success", data: total})
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}