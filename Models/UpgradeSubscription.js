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
            type: Number,
            default: 0
        },
        paymentcollected: {
            type: Number
        },
        paymentlimit: {
            type: String
        },
        status: {
            type: String,
            default: "Close"
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