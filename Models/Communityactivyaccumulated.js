const mongoose = require("mongoose");

const CommunityactivityaccumulatedSchema = new mongoose.Schema(
    {
        leaderboardamount: {
            type: Number
        },

        grindingamount: {
            type: Number
        },

        questamount: {
            type: Number
        },
    },
    {
        timestamps: true
    }
)

const Communityactivityaccumulated = mongoose.model("Communityactivityaccumulated", CommunityactivityaccumulatedSchema);
module.exports = Communityactivityaccumulated