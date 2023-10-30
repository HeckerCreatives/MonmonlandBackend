const Ads = require("../Models/Ads")

exports.update = (req, res) => {
    const { amount } = req.body

    Ads.findByIdAndUpdate(process.env.adsid, {amount: amount}, {new : true})
    .then((data) => {
        if(data){
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