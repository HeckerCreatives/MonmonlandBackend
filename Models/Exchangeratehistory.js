const mongoose = require("mongoose");

const ExchangerateHistorySchema = new mongoose.Schema(
    {
        usdrateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exchangerate"
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

const ExchangerateHistory = mongoose.model("ExchangerateHistory", ExchangerateHistorySchema);
module.exports = ExchangerateHistory