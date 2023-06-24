const mongoose = require("mongoose");


const GameSchema = new mongoose.Schema(
    {
      gametitle : {
        type: String
      },
      image : {
        type: String
      },
      description : {
        type : String
      },
      selectsubscription: [{
        type: String,
        required: true
      }],
      deletedAt: {
        type: String,
    },
    },
    {
        timestamps: true
    }
)




const Games = mongoose.model("Games", GameSchema);

module.exports = Games