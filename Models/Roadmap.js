const mongoose = require("mongoose");

const RoadmapSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        image: {
            type: String
        },
        description: {
            type: String
        }
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model("Roadmap", RoadmapSchema)