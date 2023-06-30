const mongoose = require("mongoose");

const UpgradeSubscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        paymentmethod: {
            type: String
        },
        paymentdetail: {
            type: String
        },
        numberoftransaction: {
            type: String,
            default: "0"
        },
        paymentlimit: {
            type: String
        },
        status: {
            type: String,
            default: "Processing"
        },
        deletedAt: {
            type: String,
        },        
    },
    {
        timestamps: true
    }
)

const UpgradeSubscription = mongoose.model("UpgradeSubscription", UpgradeSubscriptionSchema);
module.exports = UpgradeSubscription