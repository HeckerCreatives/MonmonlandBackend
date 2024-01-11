const { paymentdetail } = require('../Admingamecontroller/Members');
const Dragonpayoutrequest = require('../Models/Dragonpayoutrequest')
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

    Dragonpayoutrequest.findOne({_id: id})
    .populate({
        path: 'paymentdetails'
    })
    .then(async (data) => {

        if(data.status !== 'pending'){
            return res.json({message: 'failed', data: 'This payout is already in process'})
        }

        const info = { 
            owner: data.paymentdetails.owner,
            FirstName: data.paymentdetails.firstname,
            MiddleName: data.paymentdetails.middlename,
            LastName: data.paymentdetails.lastname,
            Amount: data.amount,
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

    })
}