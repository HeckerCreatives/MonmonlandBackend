const Wallets = require('../Gamemodels/Wallets')
const Paymentdetail = require('../Gamemodels/Paymentdetails')
const Dragonpayout = require('../Models/Paymentdetails')
const Payout = require('../Models/Payout')
const PayoutWallet = require("../Models/PayoutWallet")
const Cashouthistory = require('../Gamemodels/Cashouthistory')
const Dragonpayoutrequest = require('../Models/Dragonpayoutrequest')
const Wallethistory = require('../Gamemodels/Wallethistory')
const Pooldetails = require("../Gamemodels/Pooldetails")
const { nanoid } = require("nanoid")
const { checkmaintenance } = require("../Utils/utils")

exports.requestpayout = async (req, res) => {
   const { amount } = req.body

   const maintenancemanual = await checkmaintenance("maintenancecashoutmanual")

   const maintenanceauto = await checkmaintenance("maintenancecashoutautomated")

   const balance = await Wallets.findOne({owner: req.user.id, wallettype: 'balance'}).then(data => data.amount)

   const payoption = await Paymentdetail.findOne({owner: req.user.id}).then(data => data.paymentoption)

   const dragonpaymentdetail = await Dragonpayout.findOne({owner: req.user.id}).then(data => data)

   const pooldetail = await Pooldetails.findOne({owner: req.user.id}).then(data => data.subscription)

   const hastopup = await Wallethistory.findOne({owner: req.user.id, type: "Topup Balance"}).then(data => data)

   const customid = nanoid(10)


   if(balance < amount){
    return res.json({message: 'failed', data: 'Not Enough Balance'})
   }

   if(!dragonpaymentdetail && !payoption){
    return res.json({message: 'failed', data: 'Please setup your payment details first in your profile section'})
   }

   if(amount < 10){
    return res.json({message: 'failed', data: 'Minimum withdrawal amount is $10'})
   }

   if(pooldetail === "Pearl"){
    return res.json({message: 'failed', data: 'Subscription must be Ruby and up'})
   }

//    if(!hastopup){
//     return res.json({message: 'failed', data: 'You must have atleast one Topup'})
//    }

   if(payoption == 'Automatic'){

    if (maintenanceauto == "1") {
        return res.json({message: "maintenance"})
    }

        const data = {
            id: customid,
            username: req.user.username,
            amount: amount,
            paymentdetails: dragonpaymentdetail._id
        }

        const cashouthistory = {
            owner: req.user.id,
            amount: amount,
            id: customid,
        }

        Dragonpayoutrequest.create(data)
        .then(async data => {
            Cashouthistory.create(cashouthistory)
            await Wallets.findOneAndUpdate({owner: req.user.id, wallettype: 'balance'}, {$inc: {amount: -amount}})
            PayoutWallet.findOneAndUpdate({name: "dragonrequest"}, {$inc: {amount: amount}})
            .then(()=> {
                res.json({message: "success"})
            })
            .catch(error => res.status(400).json({ error: error.message }));
        })
        .catch(error => res.status(400).json({ error: error.message }));
   } else if (payoption == 'Manual'){

    if (maintenancemanual == "1") {
        return res.json({message: "maintenance"})
    }
    
        const data = {
            id: customid,
            amount: amount,
            username: req.user.username,
            walletaddress: dragonpaymentdetail.paymentdetail,
            network: dragonpaymentdetail.paymentmethod,
            paymentmethod: dragonpaymentdetail.paymentmethod,
        }

        const cashouthistory = {
            id: customid,
            owner: req.user.id,
            amount: amount,
            
        }
        Payout.create(data)
        .then(async item =>{
            Cashouthistory.create(cashouthistory)
            await Wallets.findOneAndUpdate({owner: req.user.id, wallettype: 'balance'}, {$inc: {amount: -amount}})
            PayoutWallet.findOneAndUpdate({name: "request"}, {$inc: {amount: amount}})
            .then(()=> {
                res.json({message: "success"})
            })
            .catch(error => res.status(400).json({ error: error.message }));
        })
        .catch(error => res.status(400).json({ error: error.message }));
   }

}



    