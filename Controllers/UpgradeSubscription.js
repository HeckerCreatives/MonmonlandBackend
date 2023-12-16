const UpgradeSubscription = require("../Models/UpgradeSubscription")
const PaymentHistory = require('../Models/PaymentHistory')
const User = require('../Models/Users')
const AutoReceipt = require("../Models/Receiptautomated");
const TopUpWallet = require("../Models/Topupwallet")
const AdminFeeWallet = require("../Models/Adminfeewallet")
var playfab = require('playfab-sdk')
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
PlayFab.settings.titleId = process.env.monmontitleid;

module.exports.add = (request, response) => {
    UpgradeSubscription.create(request.body)
    .then(item => response.json(item))
    .catch(error => response.status(400).json({ error: error.message }));
}

module.exports.update = (request, response) => {
    UpgradeSubscription.findByIdAndUpdate(request.params.id, request.body, {new: true})
    .then(data => response.json(data))
    .catch(error => response.status(400).json({error: error.message}))
}

module.exports.getAll = (request, response) => {
    UpgradeSubscription.find()
    .populate({
      path: 'userId',
      select: "-password -token"
    })    
    .then(data => response.send(data.filter(item => !item.deletedAt)))
    .catch(error => response.send(error))
}

module.exports.paymentfilter = (req, res ) => {
  const { method } = req.body;
  if(method === "All") {
    UpgradeSubscription.find()
    .populate({
      path: 'userId',
      select: "-password -token"
    })
    .then(data => res.send({message: "success" , data: data.filter(item => !item.deletedAt)}))
    .catch(error => res.send(error))
  } else {
    UpgradeSubscription.find({paymentmethod: method})
    .populate({
      path: 'userId',
      select: "-password -token"
    })
    .then(data => res.send({message: "success" , data: data.filter(item => !item.deletedAt)}))
    .catch(error => res.send(error))
  }
  
}

module.exports.searchcashier = (req, res) => {
  const { cashier } = req.body;
  User.find({userName: { $regex: cashier, $options: "i" }})
  .then((user)=> {
    const id = user.map(user => user._id);
    const ids = {
      userId: {$in : id}
    }
    if(user.length > 0){
      UpgradeSubscription.find(ids)
      .populate({
        path: 'userId',
        select: "-password -token"
      })
      .then((data) => {
        res.send({message: "success", data: data.filter(item => !item.deletedAt)})
      })
      .catch(error => res.send(error))
    } else {
      res.send({message:"failed", data: "User not found"})
    }
  })
  .catch(error => res.send(error))
} 

module.exports.getOneUser = (request, response) => {
    UpgradeSubscription.findById(request.params.id)
    .populate({
      path: 'userId',
      select: "-password -token"
    })
    .then(data => response.json(data.banned ? "User is banned" : data))
    .catch(error => response.send(error))
}

module.exports.destroy = (request, response) => {
    UpgradeSubscription.findByIdAndUpdate(request.params.id, {
        deletedAt: new Date().toLocaleString(),
    })
    .then(() => response.json(request.params.id))
    .catch(error => response.status(400).json({ error: error.message }));
}

module.exports.destroymultiple = (request, response) => {
    const { ids } = request.body;
  
    UpgradeSubscription.updateMany(
      { _id: { $in: ids } },
      { deletedAt: new Date().toLocaleString() }
    )
      .then(() => response.json(ids))
      .catch((error) => response.status(400).json({ error: error.message }));
  };

//   lineeeeeeeeeeeeee

module.exports.addbuyer = (request, response) => {
  const { cashierId, stats } = request.body;
    PaymentHistory.create(request.body)
    .then(item => response.json(item))
    .then((data) => {
      return UpgradeSubscription.findByIdAndUpdate(
        cashierId,
        { status: stats },
        { new: true }
      )        
    })    
    .catch(error => response.status(400).json({ error: error.message }));
}

module.exports.destroybuyer = (request, response) => {
  const { cashierId, stats } = request.body;
    PaymentHistory.findByIdAndUpdate(request.params.id, {
        deletedAt: new Date().toLocaleString(),
    })    
    .then((data) => {
      return UpgradeSubscription.findByIdAndUpdate(
        cashierId,
        { status: stats },
        { new: true }
      )        
    })
    .then(() => response.json(request.params.id))
    .catch(error => response.status(400).json({ error: error.message }));
}

module.exports.updatebuyer = (request, response) => {
    const { cashierId, amount, stats, idnitopup,adminId, playfabId, playfabPrice, playfabToken } = request.body;
  

    PlayFab._internalSettings.sessionTicket = playfabToken;
    PlayFabClient.ExecuteCloudScript({
      FunctionName: "Topup",
      FunctionParameter: {
          playerId: playfabId,
          topupAmount: playfabPrice,
        },
        ExecuteCloudScript: true,
        GeneratePlayStreamEvent: true,
      }, (error, result) => {
        console.log(result)
        
        if(result){

          if(!result.hasOwnProperty("data")){
            return  response.json({message: "failed", data: result})
          }

          if(result.data.FunctionResult.message === "success"){
            UpgradeSubscription.findByIdAndUpdate(
              cashierId,
              { $inc: { paymentcollected: amount, numberoftransaction: 1 }, $set: { status: stats } },
              { new: true }
            ) 
            .then((upgradeSubscription) => {
    
              let paydata = {
                cashier: request.body.cashier,
                image: request.file.path,
                clientusername: request.body.clientusername,
                price: request.body.price
              }
    
              PaymentHistory.findByIdAndUpdate(
                request.params.id,
                paydata,
                { new: true }
              ).then(history => {
      
                TopUpWallet.findByIdAndUpdate({_id: idnitopup}, {$inc: {amount: amount}})
                .then(() => {
                  TopUpWallet.findOneAndUpdate({user: req.user._id}, {$inc: {amount: amount}})
                  .then(() => {
                    AdminFeeWallet.findByIdAndUpdate(process.env.adminfee, {$inc: {amount: 1}})
                    .then(()=> {
                      response.json({userhistory: history, roomdetails: upgradeSubscription})
                    })
                    .catch((error) => response.status(500).json({ error: error.message }));
                  })
                  .catch((error) => response.status(500).json({ error: error.message }));
                })
                .catch((error) => response.status(500).json({ error: error.message }));
              })
            })
            .catch((error) => response.status(500).json({ error: error.message }));
          }
           else if (result.data.FunctionResult.message === "failed"){
            response.status(500).json({ error: result.data.FunctionResult.data })
          }
           else{
            response.status(500).json({ error: "failed" })
          }
        } else if (error){
          response.status(500).json({ error: error })
        }
      
    })
      
};

module.exports.getAllbuyer = (request, response) => {

    PaymentHistory.find({cashier: request.user.username})
    .sort({ createdAt: -1 })   
    .then(data => response.send(data.filter(item => !item.deletedAt)))
    .catch(error => response.send(error))
}

exports.findcoinbasereceipt = (req, res) => {
  const { type } = req.body
  AutoReceipt.find({status: "success", subscriptionType: type})
  .then(data => res.send(data))
  .catch(error => res.send(error))
}

exports.iscashier = (req, res) => {
  // const {adminId} = req.body;
  UpgradeSubscription.findOne({userId: req.user._id})
  .then(data => {
    if(!data){
      res.json(false)
    } else {
      res.json(true)
    }
  })
  .catch((error) => response.status(500).json({ error: error.message }));
}

exports.findadminfee = (req,res) => {
  AdminFeeWallet.findOne()
  .then(data => {
    res.json({message: "success", data: data.amount})
  })
  .catch((error) => response.status(500).json({ error: error.message }));
}