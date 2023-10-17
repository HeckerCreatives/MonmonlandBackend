const SubscriptionUser = require("../Models/SubscriptionUser")
const Totalusers = require("../Models/Totalusers")

exports.create = (req, res) => {
   SubscriptionUser.create(req.body)
   .then((data) => {
    Totalusers.findByIdAndUpdate(process.env.totaluser, {$inc: {count: 1}})
    .then(() => {
        res.json({message: "success"})
    })
    .catch(error => response.status(400).json({ error: error.message }));
   })
   .catch((error) => response.status(500).json({ error: error.message }));
}

exports.update = (req, res) => {
    const {playfabid, subsname} = req.body;
    SubscriptionUser.findOneAndUpdate({playfabid: playfabid}, {name: subsname}, {new: true})
    .then(data => res.json({message: "success"}))
    .catch((error) => response.status(500).json({ error: error.message }));
}

exports.find = (req, res) => {
    const {subsname} = req.body;
    SubscriptionUser.find({name: subsname})
    .then(data => {
        res.json({message: "success", data: data.length})
    })
    .catch((error) => response.status(500).json({ error: error.message }));
}