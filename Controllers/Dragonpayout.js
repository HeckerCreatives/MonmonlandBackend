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

exports.process = (req, res) => {
    const { id } = req.params
    const status = 'process'

    Dragonpayoutrequest.findOne({_id: id})
    .populate({
        path: 'paymentdetails'
    })
    .then((data) => {

        if(data.status !== 'pending'){
            return res.json({message: 'failed', data: 'This payout is already in process'})
        }

        console.log(data)

    })
}