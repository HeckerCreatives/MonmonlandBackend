const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description:{
        type: String
    },
    image: {
        type: String
    }
})

module.exports = mongoose.model("News", NewsSchema);