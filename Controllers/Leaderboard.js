const Leaderboard = require("../Models/Leaderboard")

exports.update = (req, res) => {
    const { amount } = req.body

    Leaderboard.findByIdAndUpdate(process.env.leaderboardid, {amount: amount}, {new: true})
    .then(data => {
        if(data){
            res.json({message: "success", data: data})
        }
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}

exports.find = (req, res) => {
    Leaderboard.findOne()
    .then(data => {
        if(data){
            res.json({message: "success", data: data.amount})
        }
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}