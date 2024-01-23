const UpgradeSubscription = require("../Models/UpgradeSubscription")
const PaymentHistory = require('../Models/PaymentHistory')
const User = require('../Models/Users')
const AutoReceipt = require("../Models/Receiptautomated");
const TopUpWallet = require("../Models/Topupwallet")
const AdminFeeWallet = require("../Models/Adminfeewallet")
const Wallets = require("../Gamemodels/Wallets")
const Wallethistory = require('../Gamemodels/Wallethistory')
const { checkmaintenance } = require("../Utils/utils")
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

module.exports.updatebuyer = async (request, response) => {
    const { amount, stats, idnitopup, owner, actualprice } = request.body;
    const session = await Wallets.startSession()
    const maintenancecashinmanual = await checkmaintenance("maintenancecashinmanual")

    if (maintenancecashinmanual == "1") {
      return response.json({message: "maintenance"})
    }

    try {
      session.startTransaction()
      await Wallets.findOneAndUpdate({owner: owner, wallettype: 'balance'}, {$inc: {amount: actualprice}})
      .then(async data => {
        if(!data){
          await session.abortTransaction()
          return response.json({message: "failed", data: "Player Wallet not found"})
        } else {

          const history = {
            owner: owner,
            type: "Topup Balance",
            description: "Topup Balance",
            amount: actualprice,
            historystructure: "Manual Top up"
          }

          await Wallethistory.create(history)
          
          await UpgradeSubscription.findByIdAndUpdate(
            request.user._id,
            { $inc: { paymentcollected: amount, numberoftransaction: 1 }, $set: { status: stats } },
            { new: true }
          ) 
          .then((upgradeSubscription) => {

            let paydata = {
              cashier: request.user.username,
              image: request.file.path,
              clientusername: request.body.clientusername,
              price: request.body.price
            }

            PaymentHistory.findByIdAndUpdate(
              request.params.id,
              paydata,
              { new: true }
            ).then(history => {
              if(history){
                TopUpWallet.findByIdAndUpdate({_id: idnitopup}, {$inc: {amount: amount}})
                .then(() => {
                  TopUpWallet.findOneAndUpdate({user: request.user._id}, {$inc: {amount: amount}})
                  .then(() => {
                    AdminFeeWallet.findByIdAndUpdate(process.env.adminfee, {$inc: {amount: 1}})
                    .then(()=> {
                      response.json({userhistory: history, roomdetails: upgradeSubscription})
                    })
                    .catch((error) => {
                    session.abortTransaction()
                    response.status(500).json({message: "failed", data: error})
                    });
                  })
                  .catch((error) => {
                  session.abortTransaction()
                  response.status(500).json({message: "failed", data: error})
                  });
                })
                .catch((error) => {
                session.abortTransaction()
                response.status(500).json({message: "failed", data: error})
                });
              }

            })
            .catch((error) => {
            session.abortTransaction()
            response.status(500).json({message: "failed", data: error})
            });
          })
          .catch((error) => {
          session.abortTransaction()
          response.status(500).json({message: "failed", data: error})
          });
        }
      })
    } catch (error) {
      await session.abortTransaction()
      response.json({message: "failed", data: error})
    }
    
    session.endSession()
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