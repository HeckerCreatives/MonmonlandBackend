const mongoose = require("mongoose");
const TradeHistorySchema = new mongoose.Schema(
    {
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

const TradeHistory = mongoose.model("TradeHistory", TradeHistorySchema);
module.exports = TradeHistory