const mongoose = require("mongoose");

const GameactivitySchema = new mongoose.Schema(
    {
        total: {
            type: Number
        },
        initial: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Gameactivity", GameactivitySchema);