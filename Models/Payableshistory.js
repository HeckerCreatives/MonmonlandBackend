const mongoose = require("mongoose");

const PayablehistorySchema = new mongoose.Schema(
    {
        monstercoin: {
            type: Number
        },
        monstergemfarm: {
            type: Number
        },
        monstergemunilevel: {
            type: Number
        },
        unilevelpayin: {
            type: Number
        },
        leaderboard: {
            type: Number
        },
    },
    {
        timestamps: true
    }
)

const Payablehistory = mongoose.model("Payablehistory", PayablehistorySchema);
module.exports = Payablehistory