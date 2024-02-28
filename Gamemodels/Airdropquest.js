const mongoose = require("mongoose");

const AirdropquestSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gameusers"
        },
        usersub: {
            type: String
        },
        questid: {
            type: Number // numbering
        },
        questtitle: {
            type: String // quest title
        },
        mmttokenreward: {
            type: Number // tokenamount to be claim
        },
        mcttokenreward: {
            type: Number // tokenamount to be claim
        },
        acceptAt: {
            type: String, // kung kelan inacept
        },
        expiredAt: {
            type: String, // kung kelan mag eexpire
        },
        claimedAt: {
            type: String, // kung kelan niya kinuha
        }
    },
    {
        timestamps: true
    }
)

const Airdropquest = mongoose.model("Airdropquest", AirdropquestSchema);
module.exports = Airdropquest