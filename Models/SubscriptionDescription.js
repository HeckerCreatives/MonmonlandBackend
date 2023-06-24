const mongoose = require("mongoose");
const Subscription = require("./Subscription");

const SubsDescription = new mongoose.Schema(
    {
        subsId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscription"
        },
        description: {             
            type: String,
            required: true            
        },
        deletedAt: {
            type: String,
        },
    },
    {
        timestamps:true
    }
)
const SubsDesc = mongoose.model("SubsDesc", SubsDescription);
module.exports = SubsDesc;