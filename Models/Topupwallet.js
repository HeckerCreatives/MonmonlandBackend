const mongoose = require("mongoose");

const TopupwalletSchema = new mongoose.Schema(
    {
        amount : {
            type: Number,
        },
        name: {             
            type: String,           
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps:true
    }
)
const TopUpWallet = mongoose.model("TopUpWallet", TopupwalletSchema);
module.exports = TopUpWallet;