const Ingameleaderboard = require("../Gamemodels/Leaderboard");
const Walletscutoff = require("../Gamemodels/Walletscutoff");

exports.find = (req, res) => {
    Walletscutoff.aggregate([
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
            $limit: 15
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
        res.json({ message: "success", data: data });
    })
    .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
};
