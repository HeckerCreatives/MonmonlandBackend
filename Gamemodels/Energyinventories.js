const mongoose = require("mongoose");

const EnergyinventoriesSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gameusers"
        },
        name: {
            type: String
        },
        type: {
            type: String
        },
        amount: {
            type: Number,
        },
        consumableamount: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

const Energyinventories = mongoose.model("Energyinventories", EnergyinventoriesSchema);
module.exports = Energyinventories