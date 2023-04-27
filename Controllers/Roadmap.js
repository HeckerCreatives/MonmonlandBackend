const Roadmap = require("../Models/Roadmap");

module.exports.addRoadmap = (request, response) => {
    let input = request.body

    let newRoadmap = new Roadmap({
        title: input.title,
        description: input.description
    })
    return newRoadmap.save()
    .then(data => {
        return response.send(data)
    })
    .catch(error => {
        return response.send(error)
    })
}

module.exports.getOne = (request, response) => {
    Roadmap.find()
    .then(data => response.send(data))
    .catch(error => response.send(error))
}

module.exports.update = (request, response) => {
    Roadmap.findByIdAndUpdate(request.params.id, request.body, {new: true})
    .then(data => response.json(data))
    .catch(error => response.status(400).json({error: error.message}))
}