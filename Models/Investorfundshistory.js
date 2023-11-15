const mongoose = require("mongoose");

const InvestorfundsHistorySchema = new mongoose.Schema(
    {
        investorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Investorfunds"
        },
        enteredamount: {
            type: Number
        },
        createdby: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const InvestorfundsHistory = mongoose.model("InvestorfundsHistory", InvestorfundsHistorySchema);
module.exports = InvestorfundsHistory