const { paymentdetail } = require('../Admingamecontroller/Members');
const Dragonpayoutrequest = require('../Models/Dragonpayoutrequest')
const Wallets = require('../Gamemodels/Wallets')
const Exchangerate = require('../Models/Exchangerate')
const withdrawal = require("../Models/Withdrawalfee")
const PayoutWallet = require("../Models/PayoutWallet")
const Cosmetics = require("../Gamemodels/Cosmetics")
const Gameusers = require("../Gamemodels/Gameusers")
const { createpayout } = require('./Dragonpay');
const { default: mongoose } = require('mongoose');

exports.find = (req, res) => {
    const { status } = req.body

    Dragonpayoutrequest.find({status: status})
    .populate({
        path: 'paymentdetails'
    })
    .sort({createdAt: -1})
    .then((data) => {
        res.json({message: 'success', data: data})
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}

exports.process = async (req, res) => {
    const { id } = req.params
    const status = 'process'
    const rate = await Exchangerate.findOne({_id: process.env.payoutexchangerate}).then(data => data.amount)
    

    await Dragonpayoutrequest.findOne({_id: new mongoose.Types.ObjectId(id)})
    .populate({
        path: 'paymentdetails'
    })
    .then(async (data) => {
        console.log(data)

        let withdrawalfee;
        const userid = await Gameusers.findOne({username: data.username}).then(user => user._id)

        await Cosmetics.findOne({owner: userid, name: "Energy"})
        .then(item => {
            if(item){
                if(item.isequip == "1"){
                    withdrawalfee = 0.05
                } else {
                    withdrawalfee = 0.1
                }
            } else {
                withdrawalfee = 0.1
            }
        })

        if(data.status !== 'pending'){
            return res.json({message: 'failed', data: 'This payout is already in process'})
        }

        let finalamount;
        const WFtobededuct = (data.amount * withdrawalfee)
        const deductedamount = (data.amount - WFtobededuct)
        finalamount = (deductedamount * rate)
        console.log(withdrawalfee)
        const info = { 
            owner: data.id,
            FirstName: data.paymentdetails.firstname,
            MiddleName: data.paymentdetails.middlename,
            LastName: data.paymentdetails.lastname,
            Amount: finalamount,
            ProcId: data.paymentdetails.paymentmethod, 
            ProcDetail: data.paymentdetails.paymentdetail, // Account or mobile no of payout channel
            Email: data.paymentdetails.email, 
            MobileNo: data.paymentdetails.mobilenumber, 
            BirthDate: data.paymentdetails.birthdate, 
            Nationality: data.paymentdetails.nationality, 
            Street1: data.paymentdetails.address.Street1, 
            Street2: data.paymentdetails.address.Street2,   
            Barangay: data.paymentdetails.address.Barangay, 
            City : data.paymentdetails.address.City, 
            Province: data.paymentdetails.address.Province, 
            Country: data.paymentdetails.address.Country    
        }

        const payout = await createpayout(info)

        if(payout === 'success'){
            await Dragonpayoutrequest.findOneAndUpdate({id: data.id },{status: status, admin: req.user.username})
            .then(async data => {
                console.log("pasok pangalawa")
                await withdrawal.findOneAndUpdate({ userId: process.env.superadminid}, { $inc: { withdrawalfee: WFtobededuct}})
                await PayoutWallet.findOneAndUpdate({name: "dragonrequest"}, {$inc: {amount: -amount}})
                await PayoutWallet.findOneAndUpdate({name: "dragonprocess"}, {$inc: {amount: amount}})
                res.json({message: 'success', data: 'Process Succesfully'})
            })
            .catch((error) => res.status(500).json({message: 'failed', data: `pangalawa ${error.message}`}));
        } else {
            res.json({message: 'failed', data: 'Please check the payment details'})
        }

    })
    .catch((error) => res.status(500).json({message: 'failed', data: error.message}));
}

exports.reject = (req, res) => {
    const { id } = req.params
    const status = 'reject'

    Dragonpayoutrequest.findOne({_id: id})
    .populate({
        path: 'paymentdetails'
    })
    .then(async data => {

        if(data.status !== 'pending'){
            return res.json({message: 'failed', data: 'This payout is already rejected'})
        }

        await Dragonpayoutrequest.findOneAndUpdate({_id: data._id}, {status: status, admin: req.user.username})
        await PayoutWallet.findOneAndUpdate({name: "dragonrequest"}, {$inc: {amount: -data.amount}})
        await PayoutWallet.findOneAndUpdate({name: "dragonreject"}, {$inc: {amount: data.amount}})
        await Wallets.findOneAndUpdate({owner: data.paymentdetails.owner, wallettype: 'balance'}, {$inc: {amount: data.amount}})
        .then((item) => {
            if(item){
                res.json({message: 'success', data: 'Payout Rejected'})
            }
            
        })
        
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}

