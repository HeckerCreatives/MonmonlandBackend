const mongoose = require("mongoose");


const SubscriptionSchema = new mongoose.Schema(
    {
        subscriptionName : {
            type: String,
            required:true
        },
        amount : {
            type: String,
            required:true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Subscription", SubscriptionSchema);