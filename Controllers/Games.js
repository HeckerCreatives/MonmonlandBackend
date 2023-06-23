
const Games = require("../Models/Games")

module.exports.create = (request, response) => {
    Games.create(request.body)
    .then(item => response.json(item))
    .catch(error => response.status(400).json({ error: error.message }));
}

module.exports.update = (request, response) => {
    Games.findByIdAndUpdate(request.params.id, request.body, { new: true })
    .then(item => response.json(item))
    .catch(error => response.status(400).json({ error: error.message }));
}

module.exports.find = (request, response) =>
  Games.findOne({ userId: request.params.userId })
    .then(item => response.json(item))
    .catch(error => response.status(400).json({ error: error.message }));

module.exports.findall = (request, response) =>
Games.find()
  .then(item => response.json(item))
  .catch(error => response.status(400).json({ error: error.message }));    