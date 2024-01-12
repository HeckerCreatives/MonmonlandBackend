const { paymentdetail } = require('../Admingamecontroller/Members');
const Dragonpayoutrequest = require('../Models/Dragonpayoutrequest')
const Wallets = require('../Gamemodels/Wallets')
const Exchangerate = require('../Models/Exchangerate')
const withdrawal = require("../Models/Withdrawalfee")
const { createpayout } = require('./Dragonpay')

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
    const rate = await Exchangerate.findOne({_id: process.env.exchangerate}).then(data => data.amount)
    const withdrawalfee = 0.05

    Dragonpayoutrequest.findOne({_id: id})
    .populate({
        path: 'paymentdetails'
    })
    .then(async (data) => {

        if(data.status !== 'pending'){
            return res.json({message: 'failed', data: 'This payout is already in process'})
        }
        let finalamount;
        const WFtobededuct = (data.amount * withdrawalfee)
        const deductedamount = (data.amount - WFtobededuct)
        finalamount = (deductedamount * rate)

        const info = { 
            owner: data.paymentdetails.owner,
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
        console.log(payout)
        console.log(WFtobededuct)
        console.log(deductedamount)
        console.log(finalamount)
        if(payout === 'success'){
            Dragonpayoutrequest.findOneAndUpdate({_id: data._id},{status: status})
            .then(data => {
                withdrawal.findOneAndUpdate({ userId: process.env.superadminid}, { $inc: { withdrawalfee: withdrawalfee}})
                res.json({message: 'success', data: 'Process Succesfully'})
            })
        } else {
            res.json({message: 'failed', data: 'Please check the payment details'})
        }

    })
    .catch((error) => res.status(500).json({ error: error.message }));
}

exports.reject = (req, res) => {
    const { id } = req.params
    const status = 'reject'

    Dragonpayoutrequest.findOne({_id: id})
    .then(async data => {

        if(data.status !== 'reject'){
            return res.json({message: 'failed', data: 'This payout is already rejected'})
        }
        await Dragonpayoutrequest.findOneAndUpdate({_id: data._id}, {status: status})
        await Wallets.findOneAndUpdate({owner: data.paymentdetails.owner, wallettype: 'balance'}, {$inc: {amount: data.amount}})

        res.json({message: 'success', data: 'Payout Rejected'})
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}