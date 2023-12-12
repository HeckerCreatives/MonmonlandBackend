const Merchandise = require("../Models/Merchandise")
const Communityactivity = require("../Models/Communityactivity")

exports.create = (req, res) => {

    const data = [
        {
            _id: "629a98a5a881575c013b5354",
            item: "tools",
            amount: 0,
        },
        {
            _id: "629a98a5a881575c013b5355",
            item: "clock",
            amount: 0,
        },
    ]

    Merchandise.create(data)
    res.json("Merchandise created")
}

exports.update = (req, res) => {
    const {item, amount} = req.body;
    Merchandise.findOneAndUpdate({item: item},{$inc: {amount: amount}})
    .then(data => res.json({message:"success"}))
    .catch((error) => res.status(500).json({ error: error.message }));
}

exports.find = (req, res) => {
    const {item} = req.body
    Merchandise.findOne({item: item})
    .then(data => res.json({message: "success", data: data.amount}))
    .catch((error) => res.status(500).json({ error: error.message }));
}

exports.merchandise =  (req, res) => {
    const {itemname, amount,} = req.body;
    Merchandise.findOneAndUpdate({item: itemname}, {$inc: {amount: amount}})
    .then(async (data) => {
        if(data){

            // const leaderboards = (amount * 0.02)
            const complan = (amount * 0.17)
            const grinding = (amount * 0.20)
            // const quest = (amount * 0.05)
            // const diamondpools = (amount * 0.03)
            const devsshare = (amount * 0.05)
            const companyshare = (amount * 0.05)
            const officers = (amount * 0.5)
            // const marketing = (amount * 0.02)
            // const incentives = (amount * 0.03)
            const monstergem = (amount * 0.13)
            const trademerchandise = (amount * 0.35)

            // await Communityactivity.findByIdAndUpdate(process.env.leaderboardsca, {$inc: {amount: leaderboards}})
            await Communityactivity.findByIdAndUpdate(process.env.grindingca, {$inc: {amount: grinding}} )
            // await Communityactivity.findByIdAndUpdate(process.env.questca, {$inc: {amount: quest}})
            // await Communityactivity.findByIdAndUpdate(process.env.diamondpoolsca, {$inc: {amount: diamondpools}})
            await Communityactivity.findByIdAndUpdate(process.env.devsshareca, {$inc: {amount: devsshare}})
            await Communityactivity.findByIdAndUpdate(process.env.companyshareca, {$inc: {amount: companyshare}})
            await Communityactivity.findByIdAndUpdate(process.env.officersca, {$inc: {amount: officers}})
            // await Communityactivity.findByIdAndUpdate(process.env.marketingca, {$inc: {amount: marketing}})
            // await Communityactivity.findByIdAndUpdate(process.env.incentivesca, {$inc: {amount: incentives}})
            await Communityactivity.findByIdAndUpdate(process.env.monstergemca, {$inc: {amount: monstergem}})
            await Communityactivity.findByIdAndUpdate(process.env.trademerchandise, {$inc: {amount: trademerchandise}})
            await Communityactivity.findByIdAndUpdate(process.env.complanmerchandise, {$inc: {amount: complan}})
            
            res.json({message: "success"})
        } else {
            res.json({message: "failed"})
        }
                
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}