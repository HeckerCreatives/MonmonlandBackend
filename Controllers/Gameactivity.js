const { response } = require("express");
const Gameactivity = require("../Models/Gameactivity");

module.exports.Progressbar = (request, response) => {
    let input = request.body

    let newProgressbar = new Gameactivity({
        initial: input.initial,
        total: input.total
    })
    return newProgressbar.save()
    .then(data => {
        response.send(data);
    })
    .catch(error => {
        return response.send(error)
    })
}

module.exports.getOne = (request, response) => {
    Gameactivity.findById(request.params.id)
    .then(data => response.send(data))
    .catch(error => response.send(error))
}

module.exports.update = (request, response) => {
    Gameactivity.findByIdAndUpdate(request.params.id, request.body, {new: true})
    .then(data => response.json(data))
    .catch(error => response.status(400).json({error: error.message}))
}

module.exports.getall = (request, response) => {
    Gameactivity.find()
    .then(data => response.send(data))
    .catch(error => response.send(error))
}
