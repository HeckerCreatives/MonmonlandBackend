const Monmoncoin = require("../Models/Monmoncoin")

exports.updatemc = (req, res) => {
    const {amount} = req.body
    Monmoncoin.findOneAndUpdate({name: "Monster Coin"}, {$inc: {amount: amount}})
    .then(() => {
        res.json({message: "success"})
    })
    .catch(error => response.status(400).json({ error: error.message }));
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