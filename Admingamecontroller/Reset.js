const { default: mongoose } = require("mongoose")
const User = require("../Models/Users")
const Gameunlock = require("../Gamemodels/Gameunlock")
const Task = require("../Gamemodels/Task")
const Playtimegrinding = require("../Gamemodels/Playtimegrinding")
const Dailyactivities = require("../Gamemodels/Dailyactivities")
const Dailylimit = require("../Gamemodels/Dailylimit")
const Ingamegames = require("../Gamemodels/Games")
const { Worker } = require('worker_threads')
const path = require('path')
const supermonmon = path.resolve(__dirname, "./Reset/Supermonmon.js")
const palosebo = path.resolve(__dirname, "./Reset/Palosebo.js")
const monstercoin = path.resolve(__dirname, "./Reset/Monstercoin.js")
const monstergem = path.resolve(__dirname, "./Reset/Monstergem.js")
const monstergemunilevel = path.resolve(__dirname, "./Reset/Monstergemunilevel.js")
const leaderboard = path.resolve(__dirname, "./Reset/Leaderboard.js")
const energytoringuser = path.resolve(__dirname, "./Reset/Energytoringuser.js")
const resetgrindingwithmaxenergy = path.resolve(__dirname, "./Reset/Maxenergytousers.js")
exports.convertsupermonmon = (req, res) => {

    const worker = new Worker(supermonmon)
    User.findOne({_id: new mongoose.Types.ObjectId(req.user._id)})
    .populate({
        path: "roleId",
        select: "display_name"
    })
    .then((user) => {
        if(user){
            if(user.roleId.display_name == "Administrator"){
                const data = "supermonmon"
                worker.postMessage(data)
    
                worker.on('message', (result) => {
                    res.json(result)
                    worker.terminate();
                })
    
            } else {
                res.json({message: "failed", data: "You are not authorized"})
            }
        } else {
            res.json({message: "failed", data: "You are not authorized"})
        }
        
    })
    .catch(error => {
        return res.send({ message: "failed", data: error})
    })
    
}

exports.convertpalosebo = (req, res) => {

    const worker = new Worker(palosebo)
    User.findOne({_id: new mongoose.Types.ObjectId(req.user._id)})
    .populate({
        path: "roleId",
        select: "display_name"
    })
    .then((user) => {
        if(user){
            if(user.roleId.display_name == "Administrator"){
                const data = "palosebo"
                worker.postMessage(data)
    
                worker.on('message', (result) => {
                    res.json(result)
                    worker.terminate();
                })
    
            } else {
                res.json({message: "failed", data: "You are not authorized"})
            }
        } else {
            res.json({message: "failed", data: "You are not authorized"})
        }
        
    })
    .catch(error => {
        return res.send({ message: "failed", data: error})
    })
}

exports.convertmonstercoin = (req, res) => {
    const mcworker = new Worker(monstercoin)
    User.findOne({_id: new mongoose.Types.ObjectId(req.user._id)})
    .populate({
        path: "roleId",
        select: "display_name"
    })
    .then((user) => {
        if(user){
            if(user.roleId.display_name == "Administrator"){
                const data = "monstercoin"
                mcworker.postMessage(data)
    
                mcworker.on('message', (result) => {
                    res.json(result)    
                    mcworker.terminate();
                })
    
            } else {
                res.json({message: "failed", data: "You are not authorized"})
            }
        } else {
            res.json({message: "failed", data: "You are not authorized"})
        }
        
    })
    .catch(error => {
        return res.send({ message: "failed", data: error})
    })
}

exports.convertmonstergem = (req, res) => {
    const worker = new Worker(monstergem)
    User.findOne({_id: new mongoose.Types.ObjectId(req.user._id)})
    .populate({
        path: "roleId",
        select: "display_name"
    })
    .then((user) => {
        if(user){
            if(user.roleId.display_name == "Administrator"){
                const data = "monstergem"
                worker.postMessage(data)
    
                worker.on('message', (result) => {
                    res.json(result)
                    worker.terminate();
                })
    
            } else {
                res.json({message: "failed", data: "You are not authorized"})
            }
        } else {
            res.json({message: "failed", data: "You are not authorized"})
        }
        
    })
    .catch(error => {
        return res.send({ message: "failed", data: error})
    })
}

exports.convertmonstergemunilevel = (req, res) => {
    const worker = new Worker(monstergemunilevel)
    User.findOne({_id: new mongoose.Types.ObjectId(req.user._id)})
    .populate({
        path: "roleId",
        select: "display_name"
    })
    .then((user) => {
        if(user){
            if(user.roleId.display_name == "Administrator"){
                const data = "monstergemunilevel"
                worker.postMessage(data)
    
                worker.on('message', (result) => {
                    res.json(result)
                    worker.terminate();
                })
    
            } else {
                res.json({message: "failed", data: "You are not authorized"})
            }
        } else {
            res.json({message: "failed", data: "You are not authorized"})
        }
        
    })
    .catch(error => {
        return res.send({ message: "failed", data: error})
    })
}

exports.convertleaderboard = (req, res) => {
    const worker = new Worker(leaderboard)
    User.findOne({_id: new mongoose.Types.ObjectId(req.user._id)})
    .populate({
        path: "roleId",
        select: "display_name"
    })
    .then((user) => {
        if(user){
            if(user.roleId.display_name == "Administrator"){
                const data = "leaderboard"
                worker.postMessage(data)
    
                worker.on('message', (result) => {
                    res.json(result)
                    worker.terminate();
                })
    
            } else {
                res.json({message: "failed", data: "You are not authorized"})
            }
        } else {
            res.json({message: "failed", data: "You are not authorized"})
        }
        
    })
    .catch(error => {
        return res.send({ message: "failed", data: error})
    })
}

exports.grantenergytoringuser = (req, res) => {
    const worker = new Worker(energytoringuser)
    User.findOne({_id: new mongoose.Types.ObjectId(req.user._id)})
    .populate({
        path: "roleId",
        select: "display_name"
    })
    .then((user) => {
        if(user){
            if(user.roleId.display_name == "Administrator"){
                const data = "energytoringuser"
                worker.postMessage(data)
    
                worker.on('message', (result) => {
                    res.json(result)
                    worker.terminate();
                })
    
            } else {
                res.json({message: "failed", data: "You are not authorized"})
            }
        } else {
            res.json({message: "failed", data: "You are not authorized"})
        }
        
    })
    .catch(error => {
        return res.send({ message: "failed", data: error})
    })
}

exports.gameunlockreset = async (req, res) => {

    await Gameunlock.deleteMany({})
    .catch(error => {
        return res.send({ message: "failed", data: error})
    })

    return res.json({ message: "success", data: "Gameunlock collection reset successfully" });
}

exports.gametaskreset = async (req, res) => {
    try {
        // Reset the value field to 0 for all documents in the Task collection
        await Task.updateMany({}, { $set: { value: 0 } });

        return res.json({ message: "success", data: "task reset successfully" });
    } catch (error) {
        console.error('Error resetting Task collection:', error);
        return res.status(500).json({ message: "failed", data: error.message });
    }
}

exports.gameplaytimegrindingreset = async (req, res) => {

    try {
        // Reset the value field to 0 for all documents in the Playtimegrinding collection
        await Playtimegrinding.updateMany({}, { $set: { currenttime: 0 } } );

        return res.json({ message: "success", data: "playtimegrinding reset successfully" });
    } catch (error) {
        console.error('Error resetting Playtimegrinding collection:', error);
        return res.status(500).json({ message: "failed", data: error.message });
    }

}

exports.gamedailytaskreset = async (req, res) => {

    try {
        // Reset the value field to 0 for all documents in the Dailyactivities collection
        await Dailyactivities.updateMany({}, { $set: { status: "not-claimed" } } );

        return res.json({ message: "success", data: "dailytask reset successfully" });
    } catch (error) {
        console.error('Error resetting Dailyactivities collection:', error);
        return res.status(500).json({ message: "failed", data: error.message });
    }

}

exports.gamedailylimitreset = async (req, res) => {

    try {
        // Reset the value field to 0 for all documents in the Dailylimit collection
        await Dailylimit.updateMany({}, { $set: { amount: 0 } } );

        return res.json({ message: "success", data: "dailylimit reset successfully" });
    } catch (error) {
        console.error('Error resetting Dailylimit collection:', error);
        return res.status(500).json({ message: "failed", data: error.message });
    }

}

exports.gamegrindingplayreset = async (req, res) => {

    try {
        // Reset the value field to 0 for all documents in the Ingamegames collection
        await Ingamegames.updateMany({}, { $set: { status: "pending", timestarted: 0, unixtime: 0, harvestmc: 0, harvestmg: 0, harvestap: 0}});

        return res.json({ message: "success", data: "grinding play reset successfully" });
    } catch (error) {
        console.error('Error resetting Ingamegames collection:', error);
        return res.status(500).json({ message: "failed", data: error.message });
    }

}

exports.resetgrindingwithmaxenergy = (req, res) => {

    const worker = new Worker(resetgrindingwithmaxenergy)
    User.findOne({_id: new mongoose.Types.ObjectId(req.user._id)})
    .populate({
        path: "roleId",
        select: "display_name"
    })
    .then((user) => {
        if(user){
            if(user.roleId.display_name == "Administrator"){
                const data = "resetgrindingwithmaxenergy"
                worker.postMessage(data)
    
                worker.on('message', (result) => {
                    res.json(result)
                    worker.terminate();
                })
    
            } else {
                res.json({message: "failed", data: "You are not authorized"})
            }
        } else {
            res.json({message: "failed", data: "You are not authorized"})
        }
        
    })
    .catch(error => {
        return res.send({ message: "failed", data: error})
    })
    
}