const News = require("../Models/News");

module.exports.addNews = (request, response) => {
    const news = {
        title: request.body.title,
        description: request.body.description,
        image: request.file?.path
    }

    News.create(news)
    .then(item => response.json(item))
    .catch(error => response.status(400).json({ error: error.message }));
}

module.exports.getOne = (request, response) => {
    News.findById(request.params.id)
    .then(data => response.send(data))
    .catch(error => response.send(error))
}

module.exports.update = (request, response) => {
    const news = {
        title: request.body.title,
        description: request.body.description,
        image: request.file?.path
    }
    News.findByIdAndUpdate(request.params.id, news, {new: true})
    .then(data => response.json(data))
    .catch(error => response.status(400).json({error: error.message}))
}

module.exports.getAll = (request, response) => {
    News.find()
    .then(data => response.send(data.filter(item => !item.deletedAt)))
    .catch(error => response.send(error))
}

exports.destroy = (request, response) => {
    News.findByIdAndUpdate(request.params.id, {
        deletedAt: new Date().toLocaleString(),
    })
    .then(() => response.json(request.params.id))
    .catch(error => response.status(400).json({ error: error.message }));
}
  