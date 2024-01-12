const mongoose = require("mongoose");

const DragonpayoutSchema = new mongoose.Schema(
    { 
        owner: {
            type: String
        },
        TxnId: {
            type: String
        },
        Refno: {
            type: String
        }, 
        Status: {
            type: String,
            default: "pending"
        },
        FirstName: {
            type: String
        },
        MiddleName: {
            type: String
        }, 
        LastName: {
            type: String
        },
        Amount: {
            type: Number
        },
        Currency: {
            type: String
        }, 
        Description: {
            type: String
        },
        ProcId: {
            type: String
        }, 
        ProcDetail: {
            type: String
        }, 
        RunDate: {
            type: String
        }, 
        Email: {
            type: String
        }, 
        MobileNo: {
            type: String
        }, 
        BirthDate: {
            type: String
        }, 
        Nationality: {
            type: String
        }, 
        Address:
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
         }
    }
    ,
    {
        timestamps: true
    }
)

const Dragonpayout = mongoose.model("Dragonpayout", DragonpayoutSchema);
module.exports = Dragonpayout