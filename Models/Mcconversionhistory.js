const mongoose = require("mongoose");

const MchistorySchema = new mongoose.Schema(
    {
        amount: {
            type: Number
        },
        leaderboardamount: {
            type: Number
        },
        grindingamount: {
            type: Number
        },
        questamount: {
            type: Number
        },
    },
    {
        timestamps: true
    }
)

const Mchistory = mongoose.model("Mchistory", MchistorySchema);
module.exports = Mchistory