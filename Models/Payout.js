const mongoose = require("mongoose");

const PayoutSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        // requestAt: {
        //     type: String
        // },
        walletaddress:{
            type: String,
            required: true
        },
        network:{
            type: String,
            required: true
        },  
        paymentmethod:{
            type: String,
            required: true
        },     
        admin:{
            type: String
        },
        receipt:{
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