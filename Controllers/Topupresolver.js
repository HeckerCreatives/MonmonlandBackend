const TopUpResolver = require("../Models/Topupresolver")
const AutoReceipt = require("../Models/Receiptautomated")
const TopUpWallet = require("../Models/Topupwallet")
var playfab = require('playfab-sdk')
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
PlayFab.settings.titleId = process.env.monmontitleid;

exports.search = (req, res) => {
    const {searchtype, input} = req.body;
    let searchdata = {}
    searchdata[searchtype] = input
    console.log(searchdata)

    AutoReceipt.find(searchdata)
    .sort({'createdAt': -1})
    .then(data => {
        if(data.length !== 0){
            res.json({message: "success", data: data})
        } else {
            res.json({message: "failed", data: "No Data Found"})
        }
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
}

exports.resolve = (req, res) => {

    const { playfabid, amount, playfabToken, username, admin } = req.body;

    PlayFab._internalSettings.sessionTicket = playfabToken;
      PlayFabClient.ExecuteCloudScript({
        FunctionName: "Topup",
        FunctionParameter: {
          playerId: playfabid,
          topupAmount: amount,
        },
        ExecuteCloudScript: true,
        GeneratePlayStreamEvent: true,
      }, (error1, result1) => {
        if(result1.data.FunctionResult.message === "success"){
            TopUpWallet.findByIdAndUpdate({_id: process.env.automaticid}, {$inc: {amount: amount}})
            .then(()=> {

                const history = {
                    username: username,
                    playfabid: playfabid,
                    amount: amount,
                    receipt: req.file.path,
                    admin: req.user.username
                }

                TopUpResolver.create(history)
                .then(() => {
                    res.json({message: "success"})
                })
                
            })
            .catch(err => {
              return res.json({message: "failed", data: `${err} why`})
            })
        } else {
          return res.json({message: "failed", data: `${error1} eto kaya?`})
        }
      })

}

exports.find = (req, res) => {
    // const {admin} = req.body
    TopUpResolver.find({admin: req.user.username})
    .sort({'createdAt': -1})
    .then(data => {
        if(data){
            res.json({message: "success", data: data})
        } else {
            res.json({message: "failed", data: "No History Found"})
        }
    })
    .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
}