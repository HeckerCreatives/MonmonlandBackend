const mongoose = require("mongoose");
const Gameactivity = require("../Models/Gameactivity")
const GameactivityHistorySchema = new mongoose.Schema(
    {
        barId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscription"
        },
        value: {
            type: String
        },
        enteredamount: {
            type: String
        },
        createdby: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const GameactivityHistory = mongoose.model("GameactivityHistory", GameactivityHistorySchema);
module.exports = GameactivityHistory