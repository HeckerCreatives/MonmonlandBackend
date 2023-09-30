const mongoose = require("mongoose");

const AutoReceiptSchema = new mongoose.Schema(
    {
        orderCode: {
            type: String
        },
        receiptId: {
            type: String
        },
        username: {
            type: String,
        },
        amount: {
            type: Number,
        },
        subscriptionType: {
            type: String,
        },
        playerPlayfabId: {
            type: String,
        },
        status: {
            type: String,
            default: "pending"
        }
    },
    {
        timestamps:true
    }
)

const AutoReceipt = mongoose.model("AutoReceipt", AutoReceiptSchema)
module.exports = AutoReceipt;