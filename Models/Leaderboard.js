const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema(
    {
        amount: {
            type: Number
        },
    },
    {
        timestamps: true
    }
)

const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
module.exports = Leaderboard