const AutoReceipt = require("../Models/Receiptautomated.js")
const TopUpWallet = require("../Models/Topupwallet.js")
var playfab = require('playfab-sdk')
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
PlayFab.settings.titleId = process.env.monmontitleid;
const crypto = require('crypto');
const secretKey = process.env.crypto_secret;

// Decryption function
function decryptString(encryptedText, key) {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports.cancel = (req, res) => {
  const {id} = req.query;
  const decrypt = decryptString(id, secretKey)
  AutoReceipt.findOne({receiptId: decrypt})
  .then(item =>{

      if(item.status !== 'pending'){
        res.status(302)
        res.header("Location", "https://monmonland.games/")
        return res.send("This Order is already proccessed.")
      }

      AutoReceipt.findByIdAndUpdate(item._id, {status: "cancel"}, {new: true})
      .then(data => {
        // res.json({message:"success", data: data})
        res.status(302)
        res.header("Location", "https://monmonland.games/")
        res.send("Redirecting...")
      })
      .catch(err => {
        res.status(302)
        res.header("Location", "https://monmonland.games/")
        return res.send(err.message)
      })
  })
  .catch(err => {
    res.status(302)
    res.header("Location", "https://monmonland.games/")
    return res.send(err.message)
  })
}

module.exports.success = (req, res) => {
  const {id} = req.query;
  const decrypt = decryptString(id, secretKey)
  const playFabUserData = {
    Username: "monmonland",            
    Password: "monmonlandgames",           
  };

  AutoReceipt.findOne({receiptId: decrypt})
  .then(item => {
      if(!item){
        res.status(302)
        res.header("Location", "https://monmonland.games/")
        return res.send("Receipt Id Not Found")
      }

      if(item.status !== 'pending'){
        res.status(302)
        res.header("Location", "https://monmonland.games/")
        return res.send("This Order is already proccessed.")
      }

      PlayFabClient.LoginWithPlayFab(playFabUserData, (error, result) => {
        if(result){
          PlayFabClient.ExecuteCloudScript({
            FunctionName: "Topup",
            FunctionParameter: {
              playerId: item.playerPlayfabId,
              topupAmount: item.amount,
            },
            ExecuteCloudScript: true,
            GeneratePlayStreamEvent: true,
          }, (error1, result1) => {
            console.log(result1)
            if(result1.data.FunctionResult.message === "success"){
              AutoReceipt.findByIdAndUpdate(item._id, {status: "success"}, {new: true})
              .then(data => {
                TopUpWallet.findByIdAndUpdate({_id: process.env.automaticid}, {$inc: {amount: item.amount}})
                .then(()=> {
                  // res.json({message: "success", data: data})
                  res.status(302)
                  res.header("Location", "https://monmonland.games/")
                  res.send("Redirecting...")
                })
                .catch(err => {
                  res.status(302)
                  res.header("Location", "https://monmonland.games/")
                  return res.send(err.message)
                })
              })
              .catch(err => {
                res.status(302)
                res.header("Location", "https://monmonland.games/")
                return res.send(err.message)
              })
            } else {
              res.status(302)
              res.header("Location", "https://monmonland.games/")
              return res.send(error1)
            }
          })
        } else {
          res.status(302)
          res.header("Location", "https://monmonland.games/")
          return res.send(error)
       }
      })

      
  })
  .catch(err => {
    res.status(302)
    res.header("Location", "https://monmonland.games/")
    return res.send(err.message)
  })
}

exports.find = (req,res) => {
  const {status} = req.body;
  AutoReceipt.find({status: status})
  .then(item => {
    res.json({message: "success", data: item})
  })
  .catch(err => res.json({message: "Badrequest", data: err.message}))
}

exports.findtopup = (req,res) => {
  const {name} = req.body;
  TopUpWallet.findOne({name: name})
  .then(item => {
    res.json({message: "success", data: item})
  })
  .catch(err => res.json({message: "Badrequest", data: err.message}))
}