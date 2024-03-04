const { default: mongoose } = require("mongoose")
const Ingameleaderboard = require("../Gamemodels/Leaderboard")
const WalletsCutoff = require("../Gamemodels/Walletscutoff")
const Fiesta = require("../Gamemodels/Fiesta")

exports.setleaderboard = async (id, amount) => {
    return await Ingameleaderboard.findOneAndUpdate({owner: new mongoose.Types.ObjectId(id)}, { $inc: { amount: amount}})
    .then(() => "success")
    .catch(() => "bad-request")   
}

exports.checkleaderboard = async (username) => {
    await WalletsCutoff.aggregate([
        {
            $match: {
                wallettype: "directpoints",
                amount: { $gte: 1 }
            }
        },
        {
            $lookup: {
                from: "ingameleaderboards", // Use the actual collection name of Ingameleaderboard
                localField: "owner",
                foreignField: "owner",
                as: "leaderboardData"
            }
        },
        {
            $unwind: "$leaderboardData"
        },
        {
            $lookup: {
                from: "gameusers", // Assuming User is the collection name for your User model
                localField: "owner",
                foreignField: "_id",
                as: "userData"
            }
        },
        {
            $unwind: "$userData"
        },
        {
            $sort: {
                "leaderboardData.amount": -1
            }
        },
        {
            $limit: 1
        },
        {
            $project: {
                _id: 0, // Exclude _id field
                owner: "$leaderboardData.owner",
                username: "$userData.username", // Access the username through userData
                amount: "$leaderboardData.amount"
                // Add more fields if needed
            }
        }
    ])
    .then(data => {
        console.log(data[0].username)
        if(data[0].username == username){
            return "yes"
        } else {
            return "no"
        }
    })
    .catch(() => "bad-request");
}

exports.checkfiestapalosebo = async (username) => {
    await Fiesta.find({type: "palosebo", amount: { $gt: 0 }})
    .populate({
        path: "owner",
        select: "username"
    })
    .sort({amount: -1})
    .limit(1)
    .then(data => {
        if(data[0].owner.username == username){
            return "yes"
        } else {
            return "no"
        }
    })
    .catch(() => "bad-request")
}