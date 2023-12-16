const Exchangerate = require("../Models/Exchangerate");
const ExchangerateHistory = require("../Models/Exchangeratehistory")

exports.update = (req,res) => {
    const { amount, createdby } = req.body

    const history = {
        usdrateId: process.env.exchangerate,
        enteredamount: amount,
        createdby: req.user.username
    }

    Exchangerate.findByIdAndUpdate({_id: process.env.exchangerate},{amount: amount})
    .then(async data => {
        await ExchangerateHistory.create(history)
        res.json({message: "success", data: data.amount})
    })
}

exports.find = (req,res) => {

    Exchangerate.findOne({_id: process.env.exchangerate})
    .then(data => {
        res.json({message: "success", data: data.amount})
    })

}

exports.findhistory = (req, res) => {
    ExchangerateHistory.find()
    .sort({ 'createdAt': -1 })
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}