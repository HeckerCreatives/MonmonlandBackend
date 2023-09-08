const UpgradeSubscription = require("../Models/UpgradeSubscription")
const PaymentHistory = require('../Models/PaymentHistory')
const User = require('../Models/Users')

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
    .populate('userId')    
    .then(data => response.send(data.filter(item => !item.deletedAt)))
    .catch(error => response.send(error))
}

module.exports.paymentfilter = (req, res ) => {
  const { method } = req.body;
  if(method === "All") {
    UpgradeSubscription.find()
    .populate('userId')
    .then(data => res.send({message: "success" , data: data.filter(item => !item.deletedAt)}))
    .catch(error => res.send(error))
  } else {
    UpgradeSubscription.find({paymentmethod: method})
    .populate('userId')
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
      .populate({path: "userId"})
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
    .populate('userId')
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
    const { cashierId, amount, stats } = request.body;
  
      UpgradeSubscription.findByIdAndUpdate(
        cashierId,
        { $inc: { paymentcollected: amount, numberoftransaction: 1 }, $set: { status: stats } },
        { new: true }
      ) 
      .then((upgradeSubscription) => {
        return PaymentHistory.findByIdAndUpdate(
          request.params.id,
          request.body,
          { new: true }
        );
      })
      .then((data) => response.json(data))
      .catch((error) => response.status(500).json({ error: error.message }));
};

module.exports.getAllbuyer = (request, response) => {
    PaymentHistory.find()
    .sort({ createdAt: -1 })
    .populate('subscriptionlevel')    
    .then(data => response.send(data.filter(item => !item.deletedAt)))
    .catch(error => response.send(error))
}