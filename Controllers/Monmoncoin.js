const Monmoncoin = require("../Models/Monmoncoin")
const Ads = require("../Models/Ads")
const Communityactivity = require("../Models/Communityactivity")
const Investorfunds = require("../Models/Investorfunds")

exports.updatemc = async (req, res) => {
    const {amount} = req.body

    const ads = await Ads.findOne()
    .then(data => {
        return data.amount
    })

    const grinding = await Communityactivity.findOne({type: "grinding"})
    .then(data => {
        return data.amount
    })

    const quest = await Communityactivity.findOne({type: "quest"})
    .then(data => {
        return data.amount
    })

    const investor = await Investorfunds.findOne()
    .then(data => {
        return data.amount
    })

    const total = ( ads + grinding + quest + investor ) * 1000

    const mc = await Monmoncoin.findOne({name: "Monster Coin"})
    .then((data) => {
        return data.amount
    })

    if(mc < total ){
       await Monmoncoin.findOneAndUpdate({name: "Monster Coin"}, {$inc: {amount: amount}})
        .then(() => {
            res.json({message: "success"})
        })
        .catch(error => response.status(400).json({ error: error.message }));
    } else {
        const finalvalue = total - mc
        
        if(finalvalue > 0){
            await Monmoncoin.findOneAndUpdate({name: "Monster Coin"}, {$inc: {amount: finalvalue}})
            .then(() => {
              return  res.json({message: "limit", data: finalvalue})
            })
            .catch(error => response.status(400).json({ error: error.message }));
        }

        return res.json({message: "limit"})
    }
    
}

exports.updatemg = (req, res) => {
    const {amount} = req.body
    Monmoncoin.findOneAndUpdate({name: "Monster Gem"}, {$inc: {amount: amount}})
    .then(() => {
        res.json({message: "success"})
    })
    .catch(error => response.status(400).json({ error: error.message }));
}

exports.find = (req, res) => {
    const {coin} = req.body
    Monmoncoin.findOne({name: coin})
    .then((data) => {
        res.json({message: "success", data: data})
    })
    .catch(error => response.status(400).json({ error: error.message }));
}

exports.decmonstercoin = (req, res) => {
    const { amount } = req.body
    Monmoncoin.findOneAndUpdate({name: "Monster Coin"}, {$inc: {amount: -amount}})
    .then(() => {
        res.json({message: "success"})
    })
    .catch(error => response.status(400).json({ error: error.message }));
}