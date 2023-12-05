const Investorfunds = require("../Models/Investorfunds")
const InvestorfundsHistory = require("../Models/Investorfundshistory")

exports.update = (req, res) => {
    const { amount, createdby } = req.body

    const history = {
        adsId: process.env.investorfundid,
        enteredamount: amount,
        createdby: createdby
    }

    Investorfunds.findByIdAndUpdate(process.env.investorfundid, {amount: amount}, {new : true})
    .then((data) => {
        if(data){
            InvestorfundsHistory.create(history)
            res.json({message: "success", data: data})
        }
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}

exports.find = (req, res) => {
    Investorfunds.findOne()
    .then(data => {
        if(data){
            res.json({message: "success", data: data.amount})
        }
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}

exports.findhistory = (req, res) => {
    InvestorfundsHistory.find()
    .sort({ 'createdAt': -1 })
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}