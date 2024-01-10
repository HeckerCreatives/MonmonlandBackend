const mongoose = require("mongoose");

const PaymentdetailsSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gameusers"
        },
        firstname: {
            type: String
        },
        middlename: {
            type: String
        },
        lastname: {
            type: String
        },
        email: {
            type: String
        },
        mobilenumber: {
            type: String
        },
        birthdate: {
            type: String
        },
        nationality: {
            type: String
        },
        address:
        { Street1: {
           type: String
           }, 
          Street2: {
           type: String
          }, 
          Barangay: {
           type: String
          }, 
          City : {
           type: String
          }, 
          Province: {
           type: String
          }, 
          Country: {
           type: String
          }
        },
        paymentmethod: {
            type: String
        },
        paymentdetail: {
            type: String
        },
    },
    {
        timestamps: true
    }
)

const DragonPaymentdetails = mongoose.model("DragonPaymentdetails", PaymentdetailsSchema);
module.exports = DragonPaymentdetails