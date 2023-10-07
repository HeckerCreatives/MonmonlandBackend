const mongoose = require("mongoose");
// const SubsDesc = require('./SubscriptionDescription')

const SubscriptionUserSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        playfabid: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const SubscriptionUser = mongoose.model("SubscriptionUser", SubscriptionUserSchema);

module.exports = SubscriptionUser