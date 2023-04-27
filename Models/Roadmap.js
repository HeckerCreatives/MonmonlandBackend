const mongoose = require("mongoose");

const RoadmapSchema = new mongoose.Schema({
    title: {
        type: String
    },
    image: {
        type: String
    },
    description: {
        type: String
    }
})

module.exports = mongoose.model("Roadmap", RoadmapSchema)