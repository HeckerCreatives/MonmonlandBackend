const mongoose = require("mongoose");

const PayoutwalletSchema = new mongoose.Schema(
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
const PayoutWallet = mongoose.model("PayoutWallet", PayoutwalletSchema);
module.exports = PayoutWallet;