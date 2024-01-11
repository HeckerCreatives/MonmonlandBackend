const Wallets = require('../Gamemodels/Wallets')
const Paymentdetail = require('../Gamemodels/Paymentdetails')
const Dragonpayout = require('../Models/Paymentdetails')
const Payout = require('../Models/Payout')
const PayoutWallet = require("../Models/PayoutWallet")
const Cashouthistory = require('../Gamemodels/Cashouthistory')
const Dragonpayoutrequest = require('../Models/Dragonpayoutrequest')
const { nanoid } = require("nanoid")


exports.requestpayout = async (req, res) => {
    const { amount } = req.body

   const balance = await Wallets.findOne({owner: req.user.id, wallettype: 'balance'}).then(data => data.amount)

   const payoption = await Paymentdetail.findOne({owner: req.user.id}).then(data => data.paymentoption)

   const dragonpaymentdetail = await Dragonpayout.findOne({owner: req.user.id}).then(data => data)
    
   if(balance < amount){
    return res.json({message: 'failed', data: 'Not Enough Balance'})
   }

   if(!dragonpaymentdetail && !payoption){
    return res.json({message: 'failed', data: 'Please setup your payment details first in your profile section'})
   }

   if(payoption == 'Automatic'){
        const data = {
            username: req.user.username,
            amount: amount,
            paymentdetails: dragonpaymentdetail._id
        }

        const cashouthistory = {
            owner: req.user.id,
            amount: amount
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
        const data = {
            id: nanoid(10),
            amount: amount,
            username: req.user.username,
            walletaddress: dragonpaymentdetail.paymentdetail,
            network: dragonpaymentdetail.paymentmethod,
            paymentmethod: dragonpaymentdetail.paymentmethod,
        }

        const cashouthistory = {
            owner: req.user.id,
            amount: amount
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