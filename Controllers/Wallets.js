const Wallets = require("../Models/Wallets")
const User = require('../Models/Users')

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

