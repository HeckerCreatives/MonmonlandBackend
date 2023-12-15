const Subscription = require("../Models/Subscription"); // subsLevel
const SubsDesc = require("../Models/SubscriptionDescription");

module.exports.addSubscription = async (request, response) => {
    const { subscriptionName, amount, description } = request.body;

  try {
    // Create a new subscription
    const newSubs = new Subscription({
      subscriptionName: subscriptionName,
      amount: amount,
    });

    // Save the subscription
    const savedSubs = await newSubs.save();

    // Create a new subscription description
    const newSubsDesc = new SubsDesc({
      subsId: savedSubs._id,
      amount: amount,
      description: description,
    });

    // Save the subscription description
    const savedSubsDesc = await newSubsDesc.save();

    return response.send(savedSubsDesc);
  } catch (error) {
    return response.send(error);
  }
}

module.exports.addDescription = async (request, response) => {
  const {description}  = request.body;
  const subscriptionId = request.params.id;
  try {
    // Find the existing subscription
    const existingSubs = await Subscription.findById(subscriptionId);

    if (!existingSubs) {
      return response.status(404).send('Subscription not found');
    }

    let subsDesc = await SubsDesc.findOne({ subsId: subscriptionId })
    // Create a new subscription description
    if (subsDesc !== null && subsDesc !== undefined) {
      subsDesc = new SubsDesc({
        subsId: subscriptionId,
        description: description,
      });
    } else {
      subsDesc = new SubsDesc({
        subsId: subscriptionId,
        description: description,
      });
    }

    // Save the new subscription description
    const savedSubsDesc = await subsDesc.save();

    return response.send(savedSubsDesc);
  } catch (error) {
    return response.send(error);
  }
}

module.exports.getOne = (request, response) => {
    Subscription.findById(request.params.id)
    .then(data => response.send(data))
    .catch(error => response.send(error))
}

module.exports.getOneDes = (request, response) => {
    SubsDesc.find({subsId: request.params.id})
    .then(data => response.send(data.filter(item => !item.deletedAt)))
    .catch(error => response.send(error))
}

module.exports.updateDesc = async (request, response) => {
    const { description } = request.body;
    const subscriptionId = request.params.id
    try {
      // const SubsId = await Subscription.findById(
      //   subscriptionId);
  
      // if (!SubsId) {
      //   return response.status(404).send("Subscription not found");
      // }
  
      // Update or create the subscription description
      let subsDesc = await SubsDesc.findById(subscriptionId);
      
      
      subsDesc.description = description;
      
  
      // Save the updated or new subscription description
      const updatedSubsDesc = await subsDesc.save();
  
      return response.send(updatedSubsDesc);
    } catch (error) {
      return response.send(error);
    }
}

module.exports.update = (request, response) => {
  
  const data = {
    subscriptionName: request.body?.subscriptionName,
    amount: request.body?.amount,
    image: request.file?.path
  }

  Subscription.findByIdAndUpdate(request.params.id, data, {new: true})
  .then(data => response.json(data))
  .catch(error => response.status(400).json({error: error.message}))
}



module.exports.getAll = (request, response) => {
    Subscription.find()
    .then(data => response.send(data))
    .catch(error => response.send(error))
}

module.exports.getAllDesc = (request, response) => {
    SubsDesc.find()
    .then(data => response.send(data.filter(item => !item.deletedAt)))
    .catch(error => response.send(error))
}



module.exports.save = (request, response) => {
    Subscription.create(request.body)
    .then(item => response.json(item))
    .catch(error => res.status(400).json({ error: error.message }));
}

exports.destroyDesc = (request, response) => {
  SubsDesc.findByIdAndUpdate(request.params.id, {
      deletedAt: new Date().toLocaleString(),
  })
  .then(() => response.json(request.params.id))
  .catch(error => response.status(400).json({ error: error.message }));
}