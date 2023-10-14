const Totalusers = require("../Models/Totalusers")

exports.update = (req, res) => {
    Totalusers.findByIdAndUpdate(process.env.totaluser, {$inc: {count: 1}})
    .then(() => {
        res.json({message: "success"})
    })
    .catch(error => response.status(400).json({ error: error.message }));
}

exports.find = (req, res) => {
    Totalusers.findOne({})
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch(error => response.status(400).json({ error: error.message }));
}