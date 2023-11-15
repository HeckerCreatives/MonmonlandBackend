const mongoose = require("mongoose");

const AdsHistorySchema = new mongoose.Schema(
    {
        adsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ads"
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

const AdsHistory = mongoose.model("AdsHistory", AdsHistorySchema);
module.exports = AdsHistory