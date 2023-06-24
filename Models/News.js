const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        image: {
            type: String
        },
        deletedAt: {
            type: String,
        },
    },
    {
        timestamps: true
    }
)

const News = mongoose.model("News", NewsSchema);
module.exports = News