const mongoose = require("mongoose");
// Total users ingame registers
const TotalusersSchema = new mongoose.Schema(
    {
        count: {
            type: Number
        },
    },
    {
        timestamps: true
    }
)

const Totalusers = mongoose.model("Totalusers", TotalusersSchema);

module.exports = Totalusers