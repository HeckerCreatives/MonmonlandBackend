const UpgradeSubscription = require("../Models/UpgradeSubscription")

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