const Monmoncoin = require("../Models/Monmoncoin")
const Ads = require("../Models/Ads")
const Communityactivity = require("../Models/Communityactivity")
const Investorfunds = require("../Models/Investorfunds")
const Gameactivity = require("../Models/Gameactivity")

exports.updatemc = async (req, res) => {
    const {amount, islimit} = req.body

    const additional = await Gameactivity.findOne()
    .then(data => {
        return data.total
    })

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

    const total = ( ads + grinding + quest + investor + additional ) * 1000

    const mc = await Monmoncoin.findOne({name: "Monster Coin"})
    .then((data) => {
        return data.amount
    })

    if(mc < total ){
        if(islimit === false){
            await Monmoncoin.findOneAndUpdate({name: "Monster Coin"}, {$inc: {amount: amount}})
            .then(() => {
                res.json({message: "success"})
            })
            .catch(error => response.status(400).json({ error: error.message }));
        } else {
           return res.json({message: "success"})
        }
    } else {
        const finalvalue = total - mc
        
        if(finalvalue > 0){
            if(islimit === false){
                await Monmoncoin.findOneAndUpdate({name: "Monster Coin"}, {$inc: {amount: finalvalue}})
                .then(() => {
                  return  res.json({message: "limit", data: finalvalue})
                })
                .catch(error => response.status(400).json({ error: error.message }));
            } else {
                return  res.json({message: "limit"})
            }
        }

        return res.json({message: "limit"})
    }
    
}

exports.updatemg = async (req, res) => {
    const {amount, islimit} = req.body

    const additionalmg = await Gameactivity.findOne()
    .then(data => {
        return data.initial
    })

    const mgca = await Communityactivity.findOne({type: "monstergem"})
    .then(data => {
        return data.amount
    })

    const mg = await Monmoncoin.findOne({name: "Monster Gem"})
    .then((data)=> {
        return data.amount
    })

    const total = (additionalmg + mgca)

    if(mg < total){
        if(islimit === false){
            await Monmoncoin.findOneAndUpdate({name: "Monster Gem"}, {$inc: {amount: amount}})
            .then(() => {
                res.json({message: "success"})
            })
            .catch(error => response.status(400).json({ error: error.message }));
        } else {
            return res.json({message: "success"})
        }
       
    } else {
        const finalvalue = total - mg

        if(islimit === false){
            await Monmoncoin.findOneAndUpdate({name: "Monster Gem"}, {$inc: {amount: finalvalue}})
            .then(() => {
                return res.json({message: "limit", data: finalvalue})
            })
            .catch(error => res.status(400).json({ error: error.message }));
        } else {
            return  res.json({message: "limit"})
        }
        return  res.json({message: "limit"})
    }

    
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