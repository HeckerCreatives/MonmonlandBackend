const mongoose = require("mongoose");
const Subscription = require("./Subscription");

const SubsDescription = mongoose.Schema(
    {
        subsId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: Subscription
        },
        description: {             
            type: String,
            required: true            
        }
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model("SubsDesc", SubsDescription);