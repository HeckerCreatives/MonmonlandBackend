const mongoose = require("mongoose");

const GameactivitySchema = new mongoose.Schema({
    total: {
        type: Number
    },
    initial: {
        type: Number
    }
})

module.exports = mongoose.model("Gameactivity", GameactivitySchema);