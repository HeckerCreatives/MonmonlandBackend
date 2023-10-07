const mongoose = require("mongoose");

const AdminFeeWalletSchema = new mongoose.Schema(
    {
        amount: {
            type: Number
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    {
        timestamps: true
    }
)

const AdminFeeWallet = mongoose.model("AdminFeeWallet", AdminFeeWalletSchema);
module.exports = AdminFeeWallet