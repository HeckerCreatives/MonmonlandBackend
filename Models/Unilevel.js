const mongoose = require("mongoose");
const UnilevelSchema = new mongoose.Schema(
    {
        username: {
            type: String
        },
        referrer: {
            type: mongoose.Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true
    }
)

const Unilevel = mongoose.model("Unilevel", UnilevelSchema);
module.exports = Unilevel