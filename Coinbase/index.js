const AutoReceipt = require("../Models/Receiptautomated.js")
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
  const id = req.body.id;
  const decrypt = decryptString(id, secretKey)
  AutoReceipt.findOne({receiptId: decrypt})
  .then(item =>{

      if(item.status !== 'pending'){
        return res.json({message: "failed", data: "This Order is already proccessed."})
      }

      AutoReceipt.findByIdAndUpdate(item._id, {status: "cancel"}, {new: true})
      .then(data => {
        res.json({message:"success", data: data})
      })
      .catch(err => res.json({message: "BadRequest", data: err.message}))
  })
  .catch(err => res.json({message: "Badrequest", data: err.message}))
}

module.exports.success = (req, res) => {
  const id = req.body.id;
  const decrypt = decryptString(id, secretKey)
  const playFabUserData = {
    Username: "monmonland",            
    Password: "monmonlandgames",           
  };

  AutoReceipt.findOne({receiptId: decrypt})
  .then(item => {
      if(!item){
        return res.json({message: "failed", data: "Receipt Id not Found"})
      }

      if(item.status !== 'pending'){
        return res.json({message: "failed", data: "This Order is already proccessed."})
      }

      PlayFabClient.LoginWithPlayFab(playFabUserData, (error, result) => {
        if(result){
          PlayFabClient.ExecuteCloudScript({
            FunctionName: "Subscription",
            FunctionParameter: {
              playerPlayfabId: item.playerPlayfabId,
              playerUsername: item.username,
              subscriptionType: item.subscriptionType,
              subscriptionAmount: item.amount,
            },
            ExecuteCloudScript: true,
            GeneratePlayStreamEvent: true,
          }, (error1, result1) => {
            console.log(result1)
            if(result1.data.FunctionResult.message === "success"){
              AutoReceipt.findByIdAndUpdate(item._id, {status: "success"}, {new: true})
              .then(data => {
                res.json({message: "success", data: data})
              })
              .catch(err => res.json({message: "BadRequest", data: err.message}))
            } else {
              res.json(error1)
            }
          })
        } else {
          res.json(error)
        }
      })

      
  })
  .catch(err => res.json({message: "Badrequest", data: err.message}))
}