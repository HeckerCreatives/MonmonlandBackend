const Subscription = require("../Models/Subscription");

module.exports.addSubscription = async (request, response) => {
    let input = request.body

    let newSubs = new Subscription({
        title: input.title,
        descriptions:[
            {
            description: input.description
            }
        ],
        amount: input.amount,
        image: input.image

    })
    newSubs.descriptions.push({
        description: input.anotherDescription
    })
    return await newSubs.save()
    .then(data => {
        return response.send(data)
    })
    .catch(error => {
        return response.send(error)
    })
}

module.exports.getOne = (request, response) => {
    Subscription.findById(request.params.id)
    .then(data => response.send(data))
    .catch(error => response.send(error))
}

module.exports.update = (request, response) => {
    Subscription.findByIdAndUpdate(request.params.id, request.body, {new: true})
    .then(data => response.json(data))
    .catch(error => response.status(400).json({error: error.message}))
}

module.exports.getAll = (request, response) => {
    Subscription.find()
    .then(data => response.send(data))
    .catch(error => response.send(error))
}