const SubsAccumulated = require("../Models/SubsAccumulated")
const SubscriptionUser = require ("../Models/SubscriptionUser")
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
    .then(data => {
        SubscriptionUser.findOneAndUpdate({playfabid: playfabid}, {name: subsname}, {new: true})
        .then(data => res.json({message: "success"}))
        .catch((error) => response.status(500).json({ error: error.message }));
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
        // res.json({message: 'success', data: total})
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}