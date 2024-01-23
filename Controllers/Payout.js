const Payout = require("../Models/Payout")
const Wallets = require("../Gamemodels/Wallets")
const Gameusers = require("../Gamemodels/Gameusers")
const { nanoid } = require("nanoid")
const PayoutWallet = require("../Models/PayoutWallet")
const User = require("../Models/Users")
const withdrawal = require("../Models/Withdrawalfee")
var playfab = require('playfab-sdk')
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
PlayFab.settings.titleId = process.env.monmontitleid;

exports.create = (req, res) => {
    const id = nanoid(10)
    const {amount} = req.body;
    req.body["id"] = id
    Payout.create(req.body)
    .then(item =>{
        PayoutWallet.findOneAndUpdate({name: "request"}, {$inc: {amount: amount}})
        .then(()=> {
            res.json({message: "cbspayaman"})
        })
        .catch(error => res.status(400).json({ error: error.message }));
    })
    .catch(error => res.status(400).json({ error: error.message }));
}

exports.process = (req, res) => {
    const { id } = req.params
    const { playfabToken } = req.body
    const status = "process"
    Payout.find({_id: id})
    .then(async data =>{
        if(data[0].status === "pending"){
            Payout.findByIdAndUpdate(id, {status: status, admin: req.user.username}, {new: true})
                    .then(() => {
                        PayoutWallet.findOneAndUpdate({_id: process.env.requestid}, {$inc: {amount: -data[0].amount}})
                        .then(() => {
                            PayoutWallet.findOneAndUpdate({_id: process.env.processid}, {$inc: {amount: data[0].amount}})
                            .then(() => {
                                PayoutWallet.findOneAndUpdate({user: req.user._id, name: "process"}, {$inc: {amount: data[0].amount}}) // ito ay process id dapat
                                .then(() => {
                                    res.json({message: "success"})
                                })
                            })
                            .catch(error => res.status(400).json({error: error.message}))
                        })
                        .catch(error => res.status(400).json({error: error.message}))
                    })
                    .catch(error => res.status(400).json({error: error.message}))
        } else {
            res.json({message: "failed", data: "This payout is already in process"})
        }
    })
    .catch(error => res.status(400).json({error: error.message}))
    
}

exports.reject = (req, res) => {
    const { id } = req.params
    const {  playfabToken } = req.body
    const status = "reject"
    Payout.find({_id: id})
    .then(async data =>{
        if(data[0].status === "pending" || data[0].status === "process"){
            Payout.findByIdAndUpdate(id, {status: status, admin: req.user.username}, {new: true})
                    .then(() => {
                        PayoutWallet.findOneAndUpdate({_id: data[0].status === "pending" ? process.env.requestid : process.env.processid}, {$inc: {amount: -data[0].amount}})
                        .then(() => {   
                            PayoutWallet.findOneAndUpdate({_id: process.env.rejectid}, {$inc: {amount: data[0].amount}})
                            .then(() => {
                                PayoutWallet.findOneAndUpdate({user: req.user._id, name: "process"}, {$inc: {amount: -data[0].amount}}) 
                                .then(() => {
                                    PayoutWallet.findOneAndUpdate({user: req.user._id, name: "reject"}, {$inc: {amount: data[0].amount}})
                                    .then(async () => {
                                        const id = await Gameusers.findOne({username: data[0].username}).then(e => e._id)
                                        await Wallets.findOneAndUpdate({owner: id, wallettype: 'balance'}, {$inc: {amount: data[0].amount}})
                                        .then(() =>{
                                            res.json({message: "success"})
                                        })
                                })
                                })
                                
                            })
                            .catch(error => res.status(400).json({error: error.message}))
                        })
                        .catch(error => res.status(400).json({error: error.message}))
                    })
                    .catch(error => res.status(400).json({error: error.message}))
        } else {
            res.json({message: "failed", data: "This payout is already reject"})
        }
    })
    .catch(error => res.status(400).json({error: error.message}))
    
}

exports.done = (req, res) => {
    const { id } = req.params
    const { playfabToken } = req.body
    const status = "done"
    
    Payout.find({_id: id})
    .then(data =>{
        const fivepercent = data[0].amount * 0.05;
        if(data[0].status === "process"){
            Payout.findByIdAndUpdate(id, {status: status, admin: req.user.username, receipt: req.file.path}, {new: true})
            .then(() => {
                PayoutWallet.findOneAndUpdate({_id: process.env.processid}, {$inc: {amount: -data[0].amount}})
                .then(() => {
                    PayoutWallet.findOneAndUpdate({_id: process.env.doneid}, {$inc: {amount: data[0].amount}})
                    .then(() => {
                        PayoutWallet.findOneAndUpdate({user: req.user._id, name: "process"}, {$inc: {amount: -data[0].amount}}) // ito ay process id dapat
                        .then(() => {
                            PayoutWallet.findOneAndUpdate({user: req.user._id, name: "done"}, {$inc: {amount: data[0].amount}}) // ito ay done id dapat 
                            .then(() => {
                                User.findOne({userName: "superadmin"})
                                .then(data => {
                                    withdrawal.findOneAndUpdate({ userId: data._id}, { $inc: { withdrawalfee: fivepercent}})
                                    .then(async item => {
                                        if(item){
                                            res.json({message: "success"})
                                        }
                                    })
                                    .catch(error => res.status(400).json({ error: error.message }))
                                })
                                .catch(error => res.status(400).json({ error: error.message }))
                            })
                            .catch(error => res.status(400).json({error: error.message}))
                        })
                        .catch(error => res.status(400).json({error: error.message}))
                    })
                    .catch(error => res.status(400).json({error: error.message}))
                })
                .catch(error => res.status(400).json({error: error.message}))
            })
            .catch(error => res.status(400).json({error: error.message}))

        } else {
            res.json({message: "failed", data: "This payout is already done"})
        }
    })
    .catch(error => res.status(400).json({error: error.message}))
    
}

exports.reprocess = async (req, res) => {
    const { id } = req.params
    const { playfabToken } = req.body
    const status = "pending"
    // const playFabUserData = {
    //     CreateAccount: false,            
    //     CustomId: playfabid,           
    // };
    // const adminId = await User.findOne({userName: req.user.username})
    // .then(item => {
    //     return item._id
    // })
    Payout.find({_id: id})
    .then(data =>{
        const fivepercent = data[0].amount * 0.05;
        if(data[0].status === "done"){
            Payout.findByIdAndUpdate(id, {status: status, admin: ""}, {new: true})
            .then(() => {
                PayoutWallet.findOneAndUpdate({_id: process.env.doneid}, {$inc: {amount: -data[0].amount}})
                .then(() => {
                    PayoutWallet.findOneAndUpdate({_id: process.env.requestid}, {$inc: {amount: data[0].amount}})
                    .then(() => {
                        PayoutWallet.findOneAndUpdate({user: req.user._id, name: "done"}, {$inc: {amount: -data[0].amount}}) // ito ay process id dapat
                        .then(() => {
                            User.findOne({userName: "superadmin"})
                                .then(data => {
                                    withdrawal.findOneAndUpdate({ userId: data._id}, { $inc: { withdrawalfee: -fivepercent}})
                                    .then(async item => {
                                        if(item){
                                            res.json({message: "success"})
                                        }
                                    })
                                    .catch(error => res.status(400).json({ error: error.message }))
                                })
                                .catch(error => res.status(400).json({ error: error.message }))
                        })
                        .catch(error => res.status(400).json({error: error.message}))
                    })
                    .catch(error => res.status(400).json({error: error.message}))
                })
                .catch(error => res.status(400).json({error: error.message}))
            })
            .catch(error => res.status(400).json({error: error.message}))
            
        } else {
            res.json({message: "failed", data: "This payout is already in reprocess"})
        }
    })
    .catch(error => res.status(400).json({error: error.message}))
    
}

exports.adminfind = (req, res) => {
    const {status} = req.body
    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    }
    Payout.find({status: status})
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .sort({'createdAt': 1})
    .then(user => {
        Payout.countDocuments({status: status})
        .then(count => {
            const totalPages = Math.ceil(count / pageOptions.limit)
            res.json({ message: "success", data: user, pages: totalPages })
        })
        .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
}

// pang find ng kanyang sariling transaction - cashier
exports.agentfind = (req, res) => {
    const { status} = req.body
    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    }
    Payout.find({status: status, admin: req.user.username})
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .sort({'createdAt': 1})
    .then(user => {
        Payout.countDocuments({status: status, admin: req.user.username})
        .then(count => {
            const totalPages = Math.ceil(count / pageOptions.limit)
            res.json({ message: "success", data: user, pages: totalPages })
        })
        .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
}

exports.findpayoutwallet = (req, res) => {
    const {name} = req.body;
    PayoutWallet.find({user: process.env.superadminid, name: name})
    .populate({
        path: "user",
        select: "-password -token"
    })
    .then(item => {
        res.json({message: "success", data: item})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
}

exports.agentpayoutwallet = (req, res) => {
    const {adminId, item} = req.body;
    PayoutWallet.find({user: req.user._id, name: item})
    .populate({
        path: "user",
        select: "-password -token"
    })
    .then(item => {
        res.json({message: "success", data: item})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
}

// wallet creation for existing user
exports.createexsisting = async (req, res) => {
    try {
        // Fetch all existing users from your User model
        const existingUsers = await User.find({});
    
        // Loop through each user and create a wallet for them
        for (const user of existingUsers) {
            if(user.userName !== "superadmin"){
                const walletData = [
                    {
                    amount: 0,
                    name: "process",
                    user: user._id
                    },
                    {
                      amount: 0,
                      name: "done",
                      user: user._id
                    },
                    {
                        amount: 0,
                        name: "reject",
                        user: user._id
                    },
                  ]
            
                  // Create a new wallet document for the user
                  PayoutWallet.create(walletData);
            
                  // Save the wallet document to the database
                //   await wallet.save();
              }
          
        }
    
        res.status(201).json({ message: 'Payout Wallets created for existing users' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

exports.pangreject = (req, res) => {
    
    Payout.find({$or:[{"status":{"$in":["process","pending"]}}]})
    .then((data) => {
        const item = data.map(e => e._id)

        Payout.updateMany({ _id: { $in: item } }, {status: "reject"})
        .then((data) => {
            res.json({message: "success"})
        })
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
}

// ---------------------------------------- //

