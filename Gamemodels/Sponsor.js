const mongoose = require("mongoose");

const SponsorSchema = new mongoose.Schema(
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
            default: 0
        },
    },
    {
        timestamps: true
    }
)

const Sponsor = mongoose.model("Sponsor", SponsorSchema);
module.exports = Sponsor