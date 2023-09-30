const Payout = require("../Models/Payout")
const { nanoid } = require("nanoid")

exports.create = (req, res) => {

    const id = nanoid(10)
    req.body["id"] = id
    Payout.create(req.body)
    .then(item => res.json(item))
    .catch(error => res.status(400).json({ error: error.message }));
}

exports.process = (req, res) => {
    const { id } = req.params
    const { admin } = req.body
    const status = "process"
    Payout.find({_id: id})
    .then(data =>{
        if(data[0].status === "pending"){
            Payout.findByIdAndUpdate(id, {status: status, admin: admin}, {new: true})
            .then(() => res.json({message: "success"}))
            .catch(error => res.status(400).json({error: error.message}))
        } else {
            res.json({message: "failed", data: "This payout is already in process"})
        }
    })
    .catch(error => res.status(400).json({error: error.message}))
    
}

exports.done = (req, res) => {
    const { id } = req.params
    const { admin, receipt } = req.body
    const status = "done"
    Payout.find({_id: id})
    .then(data =>{
        if(data[0].status === "process"){
            Payout.findByIdAndUpdate(id, {status: status, admin: admin, receipt: receipt}, {new: true})
            .then(() => res.json({message: "success"}))
            .catch(error => res.status(400).json({error: error.message}))
        } else {
            res.json({message: "failed", data: "This payout is already done"})
        }
    })
    .catch(error => res.status(400).json({error: error.message}))
    
}

exports.reprocess = (req, res) => {
    const { id } = req.params
    // const { admin } = req.body
    const status = "pending"
    Payout.find({_id: id})
    .then(data =>{
        if(data[0].status === "done"){
            Payout.findByIdAndUpdate(id, {status: status, admin: ""}, {new: true})
            .then(() => res.json({message: "success"}))
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