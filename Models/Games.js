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
      }]
    },
    {
        timestamps: true
    }
)




const Games = mongoose.model("Games", GameSchema);

module.exports = Games