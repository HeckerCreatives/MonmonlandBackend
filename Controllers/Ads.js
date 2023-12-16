const Ads = require("../Models/Ads")
const AdsHistory = require("../Models/Adsinhistory")

exports.update = (req, res) => {
    const { amount, createdby } = req.body
  
    const history = {
      adsId: process.env.adsid,
      enteredamount: amount,
      createdby: req.user.username
    }

    Ads.findByIdAndUpdate(process.env.adsid, {amount: amount}, {new : true})
    .then((data) => {
        if(data){
            AdsHistory.create(history)
            res.json({message: "success", data: data})
        }
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}

exports.find = (req, res) => {
    Ads.findOne()
    .then(data => {
        if(data){
            res.json({message: "success", data: data.amount})
        }
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}

exports.findhistory = (req, res) => {
    AdsHistory.find()
    .sort({ 'createdAt': -1 })
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}