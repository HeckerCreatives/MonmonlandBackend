const mongoose = require("mongoose");

const PayoutSchema = new mongoose.Schema(
    {
        id: {
            type: String
        },
        username: {
            type: String
        },
        amount: {
            type: String
        },
        requestAt: {
            type: String
        },
        walletaddress:{
            type: String
        },
        network:{
            type: String
        },  
        paymentmethod:{
            type: String
        },     
        admin:{
            type: String
        },
        status:{
            type: String,
            default: "pending"
        }       
    },
    {
        timestamps: true
    }
)

const PayoutHistory = mongoose.model("PayoutHistory", PayoutSchema);
module.exports = PayoutHistory