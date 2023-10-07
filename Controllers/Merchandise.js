const Merchandise = require("../Models/Merchandise")


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