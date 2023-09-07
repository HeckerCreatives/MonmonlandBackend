const mongoose = require("mongoose");
// const SubsDesc = require('./SubscriptionDescription')

const SubscriptionSchema = new mongoose.Schema(
    {
        subscriptionName : {
            type: String,
            required:true
        },
        amount : {
            type: String,
            required: true
        },
        image: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription