const mongoose = require("mongoose");

const DragonpayoutrequestSchema = new mongoose.Schema(
    { 
        username: {
            type: String
        },
        amount: {
            type: Number
        },
        paymentdetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DragonPaymentdetails"
        }
    },
    {
        timestamps: true
    }
)

const Dragonpayoutrequest = mongoose.model("Dragonpayoutrequest", DragonpayoutrequestSchema);
module.exports = Dragonpayoutrequest