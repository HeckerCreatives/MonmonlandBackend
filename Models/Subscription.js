const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    title: {
        type: String
    },
    amount: {
        type: String
    },
    descriptions: [ String 
    ],
    image: {
        type: String
    }
})

module.exports = mongoose.model("Subscription", SubscriptionSchema);