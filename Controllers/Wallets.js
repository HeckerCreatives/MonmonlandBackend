const Wallets = require("../Models/Wallets")
const User = require('../Models/Users')
const TopUpWallet = require("../Models/Topupwallet.js")
const PayoutWallet = require("../Models/PayoutWallet.js")
// wallet creation for existing user
exports.createexsisting = async (req, res) => {
    try {
        // Fetch all existing users from your User model
        const existingUsers = await User.find({});
    
        // Loop through each user and create a wallet for them
        for (const user of existingUsers) {
          const walletData = {
            userId: user._id, // Set the user's ID as the userId in the wallet schema
            commission: 0,    // Set an initial commission value if needed
          };
    
          // Create a new wallet document for the user
          const wallet = new Wallets(walletData);
    
          // Save the wallet document to the database
          await wallet.save();
        }
    
        res.status(201).json({ message: 'Wallets created for existing users' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

exports.sendcommission = async (req, res) => {
    const { amount } = req.body
    const session = await Wallets.startSession();
    try {
    User.findOne({userName: "superadmin"})
    .then(data => {
        session.startTransaction();
        Wallets.findOneAndUpdate({ userId: data._id}, { $inc: { commission: +amount}})
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
  // const {id} = req.body;
  Wallets.find({userId: req.user._id})
  .then(data => {
    res.json({message: "success", data: data})
  })
  .catch(error => res.status(400).json({ error: error.message }))
}

exports.findsoftlaunchwallet = (req,res) => {

  TopUpWallet.find({user: process.env.superadminid})
  .then(item => {

    const softlaunchmanual = item.find(e => e.name === 'softlaunchmanual')
    const softlaunchauto = item.find(e => e.name === 'softlaunchautomatic')

    const summary = {
      "softlaunchmanual": softlaunchmanual.amount,
      "softlaunchauto": softlaunchauto.amount,
      "softlaunchtotal": softlaunchmanual.amount + softlaunchauto.amount
    }

    res.json({message: "success", data: summary})
  })
  .catch(err => res.json({message: "Badrequest", data: err.message}))
}

exports.findcombinedsalehwallet = (req,res) => {

  TopUpWallet.find({user: process.env.superadminid})
  .then(item => {

    const softlaunchmanual = item.find(e => e.name === 'softlaunchmanual')
    const softlaunchauto = item.find(e => e.name === 'softlaunchautomatic')
    const grandlaunchmanual = item.find(e => e.name === 'manual')
    const grandlaunchauto = item.find(e => e.name === 'automatic')


    const totalmanual = softlaunchmanual.amount + grandlaunchmanual.amount
    const totalauto = softlaunchauto.amount + + grandlaunchauto.amount
    const totalcombinesale = softlaunchmanual.amount + softlaunchauto.amount + grandlaunchmanual.amount + grandlaunchauto.amount
    const summary = {
      "totalmanual": totalmanual,
      "totalauto": totalauto,
      "combinetotal": totalcombinesale
    }

    res.json({message: "success", data: summary})
  })
  .catch(err => res.json({message: "Badrequest", data: err.message}))
}

exports.dragonpayoutwallet = (req, res) => {
  PayoutWallet.find({user: process.env.superadminid})
  .then(item => {

    const dragonrequest = item.find(e => e.name === 'dragonrequest')
    const dragonprocess = item.find(e => e.name === 'dragonprocess')
    const dragondone = item.find(e => e.name === 'dragondone')
    const dragonreject = item.find(e => e.name === 'dragonreject')
    const dragontotal = dragonrequest.amount + dragonprocess.amount + dragondone.amount
    
    const summary = {
      "dragonrequest": dragonrequest.amount,
      "dragonprocess": dragonprocess.amount,
      "dragondone": dragondone.amount,
      "dragonreject": dragonreject.amount,
      "dragontotal": dragontotal
    }

    res.json({message: "success", data: summary})
  })
  .catch(err => res.json({message: "Badrequest", data: err.message}))
}