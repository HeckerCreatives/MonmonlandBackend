const mongoose = require("mongoose");
const UnilevelSchema = new mongoose.Schema(
    {
        username: {
            type: String
        },
        referrer: {
            type: String
        },
    },
    {
        timestamps: true
    }
)

const Unilevel = mongoose.model("Unilevel", UnilevelSchema);
module.exports = Unilevel