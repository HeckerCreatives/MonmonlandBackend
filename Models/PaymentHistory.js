const mongoose = require("mongoose");

const PaymentHistorySchema = new mongoose.Schema(
    {
        cashier: {
            type: String
        },
        transactionnumber: {
            type: String
        },
        subscriptionlevel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscription"
        },
        price: {
            type: Number
        },
        clientusername:{
            type: String
        },
        image:{
            type: String
        },      
        deletedAt:{
            type: String
        }        
    },
    {
        timestamps: true
    }
)

const PaymentHistory = mongoose.model("PaymentHistory", PaymentHistorySchema);
module.exports = PaymentHistory