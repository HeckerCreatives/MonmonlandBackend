const mongoose = require("mongoose");

const ExchangerateSchema = new mongoose.Schema(
    {
        amount: {
            type: Number
        },
    },
    {
        timestamps: true
    }
)

const Exchangerate = mongoose.model("Exchangerate", ExchangerateSchema);
module.exports = Exchangerate