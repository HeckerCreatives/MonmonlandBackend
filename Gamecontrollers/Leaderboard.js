const Ingameleaderboard = require("../Gamemodels/Leaderboard")

exports.find = (req, res) => {

    Ingameleaderboard.find()
    .populate({
        path: "owner",
        select: "-password -token"
    })
    .sort({amount: -1})
    .limit(15)
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}