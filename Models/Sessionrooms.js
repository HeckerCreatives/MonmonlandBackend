const mongoose = require("mongoose");

const UploadSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        urlimg: {
            type: [String]
        },
        path: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const Upload = mongoose.model("Upload", UploadSchema);

module.exports = Upload;