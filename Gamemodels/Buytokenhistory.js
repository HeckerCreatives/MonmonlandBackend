const mongoose = require("mongoose");

const BuytokenhistorySchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gameusers"
        },
        id: {
            type: String
        },
        type: {
            type: String // mmt or mct
        },
        tokenreceive: {
            type: Number, // token amount to be recieve
        },
        amount: {
            type: Number, // dollar amount
        },
        status: {
            type: String // pending - approve - reject
            
        },
        transactiontype: {
            type: String // walletbalance, mg, bnb, usdt, busd
        }
    },
    {
        timestamps: true
    }
)

const Buytokenhistory = mongoose.model("Buytokenhistory", BuytokenhistorySchema);
module.exports = Buytokenhistory