const mongoose = require("mongoose");

const ApkSchema = new mongoose.Schema(
    {
        path: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const Apk = mongoose.model("Apk", ApkSchema);
module.exports = Apk