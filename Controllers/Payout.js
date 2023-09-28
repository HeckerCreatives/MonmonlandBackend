const Payout = require("../Models/Payout")

exports.create = (req, res) => {
    Payout.create(req.body)
    .then(item => res.json(item))
    .catch(error => res.status(400).json({ error: error.message }));
}

exports.update = (req, res) => {
    Payout.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(data => res.json(data))
    .catch(error => res.status(400).json({error: error.message}))
}