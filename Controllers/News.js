const News = require("../Models/News");

module.exports.addNews = (request, response) => {
    let input = request.body

    let newNews = new News({
        title: input.title,
        description: input.description,
        image: input.image
    })
    return newNews.save()
    .then(data => {
        return response.send(data)
    })
    .catch(error => {
        return response.send(error)
    })
}

module.exports.getOne = (request, response) => {
    News.findById(request.params.id)
    .then(data => response.send(data))
    .catch(error => response.send(error))
}

module.exports.update = (request, response) => {
    News.findByIdAndUpdate(request.params.id, request.body, {new: true})
    .then(data => response.json(data))
    .catch(error => response.status(400).json({error: error.message}))
}

module.exports.getAll = (request, response) => {
    News.find()
    .then(data => response.send(data))
    .catch(error => response.send(error))
}