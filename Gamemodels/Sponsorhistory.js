const mongoose = require("mongoose");

const SponsorhistorySchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gameusers"
        },
        type: {
            type: String,
        },
        amount: {
            type: Number,
        },
    },
    {
        timestamps: true
    }
)

const Sponsorhistory = mongoose.model("Sponsorhistory", SponsorhistorySchema);
module.exports = Sponsorhistory