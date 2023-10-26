const mongoose = require("mongoose");
// const SubsDesc = require('./SubscriptionDescription')

const TopUpResolverSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        playfabid: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        admin: {
            type: String,
            required: true
        },
        receipt: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

const TopUpResolver = mongoose.model("TopUpResolver", TopUpResolverSchema);

module.exports = TopUpResolver