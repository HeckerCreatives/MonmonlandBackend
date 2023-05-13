const mongoose = require("mongoose");

const RolesSchema = mongoose.Schema(
    {
        display_name: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Roles = mongoose.model("Roles", RolesSchema);

module.exports = Roles