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
    PaymentHistory.create(request.body)
    .then(item => response.json(item))
    .catch(error => response.status(400).json({ error: error.message }));
}

module.exports.destroybuyer = (request, response) => {
    PaymentHistory.findByIdAndUpdate(request.params.id, {
        deletedAt: new Date().toLocaleString(),
    })
    .then(() => response.json(request.params.id))
    .catch(error => response.status(400).json({ error: error.message }));
}

module.exports.updatebuyer = (request, response) => {
    const { username, subscription, cashierId, amount, stats} = request.body;
  
    User.findOneAndUpdate(
      { userName: username },
      { subscriptionId: subscription },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return response.status(404).json({ error: 'User not found' });
        }
        return UpgradeSubscription.findByIdAndUpdate(
          cashierId,
          { $inc: { paymentcollected: amount, numberoftransaction: 1 }, $set: { status: stats } },
          { new: true }
        )        
      })
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
    .populate('subscriptionlevel')    
    .then(data => response.send(data.filter(item => !item.deletedAt)))
    .catch(error => response.send(error))
}