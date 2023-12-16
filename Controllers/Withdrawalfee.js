const withdrawal = require("../Models/Withdrawalfee")
const User = require("../Models/Users")

exports.create = (req, res) => {
    withdrawal.create(req.body)
    .then(() => res.json({message: "success"}))
    .catch(error => res.status(400).json({ error: error.message }))
}

exports.incwithdrawalfee = async (req, res) => {
    const { amount } = req.body
    const session = await withdrawal.startSession();
    try {
    User.findOne({userName: "superadmin"})
    .then(data => {
        session.startTransaction();
        withdrawal.findOneAndUpdate({ userId: data._id}, { $inc: { withdrawalfee: amount}})
        .then(async item => {
            if(item){
                res.json({message: "success"})
                await session.commitTransaction();
            }
        })
        .catch(error => res.status(400).json({ error: error.message }))
    })
    .catch(error => res.status(400).json({ error: error.message }))
    } catch (error) {
        await session.abortTransaction();
        res.json(error);
    }
    session.endSession();
}

exports.decwithdrawalfee = async (req, res) => {
    const { amount } = req.body
    const session = await withdrawal.startSession();
    try {
    User.findOne({userName: "superadmin"})
    .then(data => {
        session.startTransaction();
        withdrawal.findOneAndUpdate({ userId: data._id}, { $inc: { withdrawalfee: -amount}})
        .then(async item => {
            if(item){
                res.json({message: "success"})
                await session.commitTransaction();
            }
        })
        .catch(error => res.status(400).json({ error: error.message }))
    })
    .catch(error => res.status(400).json({ error: error.message }))
    } catch (error) {
        await session.abortTransaction();
        res.json(error);
    }
    session.endSession();
}

exports.find = (req, res) => {
//   const {id} = req.body;
  withdrawal.find({userId: req.user._id})
  .then(data => {
    res.json({message: "success", data: data})
  })
  .catch(error => res.status(400).json({ error: error.message }))
}