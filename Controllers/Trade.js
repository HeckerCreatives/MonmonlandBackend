const Communityactivity = require("../Models/Communityactivity")
const TradeHistory = require("../Models/Tradehistory")

exports.updatepayin = async (req, res) => {
    const { amount, value, createdby } = req.body

    const devsshare = (amount * 0.04)
    const companyshare = (amount * 0.03)
    const grinding = (amount * 0.40)
    const monstergem = (amount * 0.40)
    // const marketing = (amount * 0.05)
    const diamondpools = (amount * 0.05)
    const leaderboards = (amount * 0.04)
    const incentives = (amount * 0.04)
    // const officers = (amount * 0.25)
    // const quest = (amount * 0.05)
    // const tradepayin = (amount * 0.35)

    const history = {
        value: value,
        enteredamount: amount,
        createdby: createdby
    }

    await TradeHistory.create(history)

    await Communityactivity.findByIdAndUpdate(process.env.leaderboardsca, {$inc: {amount: leaderboards}})
    await Communityactivity.findByIdAndUpdate(process.env.grindingca, {$inc: {amount: grinding}} )
    // await Communityactivity.findByIdAndUpdate(process.env.questca, {$inc: {amount: quest}})
    await Communityactivity.findByIdAndUpdate(process.env.diamondpoolsca, {$inc: {amount: diamondpools}})
    await Communityactivity.findByIdAndUpdate(process.env.devsshareca, {$inc: {amount: devsshare}})
    await Communityactivity.findByIdAndUpdate(process.env.companyshareca, {$inc: {amount: companyshare}})
    // await Communityactivity.findByIdAndUpdate(process.env.officersca, {$inc: {amount: officers}})
    // await Communityactivity.findByIdAndUpdate(process.env.marketingca, {$inc: {amount: marketing}})
    await Communityactivity.findByIdAndUpdate(process.env.incentivesca, {$inc: {amount: incentives}})
    await Communityactivity.findByIdAndUpdate(process.env.monstergemca, {$inc: {amount: monstergem}})

    res.json({message: "success"})

}

exports.find = (req, res) => {

    TradeHistory.find()
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}


exports.updatemerchandise = async (req, res) => {
    const { amount } = req.body

    const leaderboards = (amount * 0.10)
    const grinding = (amount * 0.20)
    const quest = (amount * 0.05)
    const diamondpools = (amount * 0.10)
    // const devsshare = (amount * 0.05)
    // const companyshare = (amount * 0.05)
    const officers = (amount * 0.25)
    const marketing = (amount * 0.05)
    const incentives = (amount * 0.05)
    const monstergem = (amount * 0.20)
    // const tradepayin = (amount * 0.35)

    await Communityactivity.findByIdAndUpdate(process.env.leaderboardsca, {$inc: {amount: leaderboards}})
    await Communityactivity.findByIdAndUpdate(process.env.grindingca, {$inc: {amount: grinding}} )
    await Communityactivity.findByIdAndUpdate(process.env.questca, {$inc: {amount: quest}})
    await Communityactivity.findByIdAndUpdate(process.env.diamondpoolsca, {$inc: {amount: diamondpools}})
    // await Communityactivity.findByIdAndUpdate(process.env.devsshareca, {$inc: {amount: devsshare}})
    // await Communityactivity.findByIdAndUpdate(process.env.companyshareca, {$inc: {amount: companyshare}})
    await Communityactivity.findByIdAndUpdate(process.env.officersca, {$inc: {amount: officers}})
    await Communityactivity.findByIdAndUpdate(process.env.marketingca, {$inc: {amount: marketing}})
    await Communityactivity.findByIdAndUpdate(process.env.incentivesca, {$inc: {amount: incentives}})
    await Communityactivity.findByIdAndUpdate(process.env.monstergemca, {$inc: {amount: monstergem}})

    res.json({message: "success"})
}