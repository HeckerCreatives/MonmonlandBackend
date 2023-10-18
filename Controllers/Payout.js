const Payout = require("../Models/Payout")
const { nanoid } = require("nanoid")
const PayoutWallet = require("../Models/PayoutWallet")
const User = require("../Models/Users")
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
    const { admin, adminId, playfabid, playfabToken } = req.body
    const status = "process"
    const playFabUserData = {
        CreateAccount: false,            
        CustomId: playfabid,           
    };
    Payout.find({_id: id})
    .then(async data =>{
        if(data[0].status === "pending"){
            PlayFab._internalSettings.sessionTicket = playfabToken;
            PlayFabClient.LoginWithCustomID(playFabUserData, (error, result) => {
                if(result){
                    PlayFabClient.ExecuteCloudScript({
                        FunctionName: "ProceessPayout",
                        FunctionParameter: {
                            processType: "Processing",
                            playerId: data[0].playfabId,
                            processId: data[0].playfabPayoutKey,
                        },
                        ExecuteCloudScript: true,
                        GeneratePlayStreamEvent: true,
                    }, (error1, result1) => {
                        if(result1.data.FunctionResult.message === "success"){
                            Payout.findByIdAndUpdate(id, {status: status, admin: admin}, {new: true})
                            .then(() => {
                                PayoutWallet.findOneAndUpdate({_id: process.env.requestid}, {$inc: {amount: -data[0].amount}})
                                .then(() => {
                                    PayoutWallet.findOneAndUpdate({_id: process.env.processid}, {$inc: {amount: data[0].amount}})
                                    .then(() => {
                                        PayoutWallet.findOneAndUpdate({user: adminId, name: "process"}, {$inc: {amount: data[0].amount}}) // ito ay process id dapat
                                        .then(() => {
                                            res.json({message: "success"})
                                        })
                                    })
                                    .catch(error => res.status(400).json({error: error.message}))
                                })
                                .catch(error => res.status(400).json({error: error.message}))
                            })
                            .catch(error => res.status(400).json({error: error.message}))
                        } else if (result1.data.FunctionResult.message === "failed"){
                            res.json({message: "failed", data: data.data})
                        } else if (error1){
                            res.json({message: "failed", data: error})
                        }
                    })
                } else if (error){
                    res.json({message: "failed", data: error})
                }
            })
        } else {
            res.json({message: "failed", data: "This payout is already in process"})
        }
    })
    .catch(error => res.status(400).json({error: error.message}))
    
}

exports.done = (req, res) => {
    const { id } = req.params
    const { admin, receipt, adminId, playfabid, playfabToken } = req.body
    const status = "done"
    const playFabUserData = {
        CreateAccount: false,            
        CustomId: playfabid,           
    };
    Payout.find({_id: id})
    .then(data =>{
        if(data[0].status === "process"){
            PlayFab._internalSettings.sessionTicket = playfabToken;
            PlayFabClient.ExecuteCloudScript({
                FunctionName: "ProceessPayout",
                FunctionParameter: {
                    processType: "Done",
                    playerId: data[0].playfabId,
                    processId: data[0].playfabPayoutKey,
                },
                ExecuteCloudScript: true,
                GeneratePlayStreamEvent: true,
            },(error1, result1) => {
                if(result1.data.FunctionResult.message === "success"){
                    Payout.findByIdAndUpdate(id, {status: status, admin: admin, receipt: receipt}, {new: true})
                    .then(() => {
                        PayoutWallet.findOneAndUpdate({_id: process.env.processid}, {$inc: {amount: -data[0].amount}})
                        .then(() => {
                            PayoutWallet.findOneAndUpdate({_id: process.env.doneid}, {$inc: {amount: data[0].amount}})
                            .then(() => {
                                PayoutWallet.findOneAndUpdate({user: adminId, name: "process"}, {$inc: {amount: -data[0].amount}}) // ito ay process id dapat
                                .then(() => {
                                    PayoutWallet.findOneAndUpdate({user: adminId, name: "done"}, {$inc: {amount: data[0].amount}}) // ito ay done id dapat 
                                    .then(() => {
                                        res.json({message: "success"})
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
                } else if (result1.data.FunctionResult.message === "failed"){
                    res.json({message: "failed", data: data.data})
                } else if (error1){
                    res.json({message: "failed", data: error})
                }
            })

        } else {
            res.json({message: "failed", data: "This payout is already done"})
        }
    })
    .catch(error => res.status(400).json({error: error.message}))
    
}

exports.reprocess = async (req, res) => {
    const { id } = req.params
    const { admin, playfabid, playfabToken } = req.body
    const status = "pending"
    const playFabUserData = {
        CreateAccount: false,            
        CustomId: playfabid,           
    };
    const adminId = await User.findOne({userName: admin})
    .then(item => {
        // console.log(item)
        return item._id
    })
    console.log(adminId)
    Payout.find({_id: id})
    .then(data =>{
        if(data[0].status === "done"){
            PlayFab._internalSettings.sessionTicket = playfabToken;
            PlayFabClient.ExecuteCloudScript({
                FunctionName: "ProceessPayout",
                FunctionParameter: {
                    processType: "Pending",
                    playerId: data[0].playfabId,
                    processId: data[0].playfabPayoutKey,
                },
                ExecuteCloudScript: true,
                GeneratePlayStreamEvent: true,
            },(error1, result1) => {
                if(result1.data.FunctionResult.message === "success"){
                    Payout.findByIdAndUpdate(id, {status: status, admin: ""}, {new: true})
                    .then(() => {
                        PayoutWallet.findOneAndUpdate({_id: process.env.doneid}, {$inc: {amount: -data[0].amount}})
                        .then(() => {
                            PayoutWallet.findOneAndUpdate({_id: process.env.requestid}, {$inc: {amount: data[0].amount}})
                            .then(() => {
                                PayoutWallet.findOneAndUpdate({user: adminId, name: "done"}, {$inc: {amount: -data[0].amount}}) // ito ay process id dapat
                                .then(() => {
                                    res.json({message: "success"})
                                })
                                .catch(error => res.status(400).json({error: error.message}))
                            })
                            .catch(error => res.status(400).json({error: error.message}))
                        })
                        .catch(error => res.status(400).json({error: error.message}))
                    })
                    .catch(error => res.status(400).json({error: error.message}))
                } else if (result1.data.FunctionResult.message === "failed"){
                    res.json({message: "failed", data: data.data})
                } else if (error1){
                    res.json({message: "failed", data: error})
                }
            })
            
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
    .sort({'createdAt': -1})
    .then(user => {
        Payout.countDocuments({status: status})
        .then(count => {
            const totalPages = Math.ceil(count / 10)
            res.json({ message: "success", data: user, pages: totalPages })
        })
        .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
}

// pang find ng kanyang sariling transaction - cashier
exports.agentfind = (req, res) => {
    const {admin, status} = req.body
    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    }
    Payout.find({status: status, admin: admin})
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .sort({'createdAt': -1})
    .then(user => {
        Payout.countDocuments({status: status, admin: admin})
        .then(count => {
            const totalPages = Math.ceil(count / 10)
            res.json({ message: "success", data: user, pages: totalPages })
        })
        .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
}

exports.findpayoutwallet = (req, res) => {
    const {name} = req.body;
    PayoutWallet.find({name: name})
    .populate({path: "user"})
    .then(item => {
        res.json({message: "success", data: item})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
}

exports.agentpayoutwallet = (req, res) => {
    const {adminId, item} = req.body;
    PayoutWallet.find({user: adminId, name: item})
    .populate({path: "user"})
    .then(item => {
        res.json({message: "success", data: item})
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
}