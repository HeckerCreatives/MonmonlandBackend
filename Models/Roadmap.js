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

const Roadmap = mongoose.model("Roadmap", RoadmapSchema)
module.exports = Roadmap;