
const Games = require("../Models/Games")

module.exports.create = (request, response) => {
    const game = {
      gametitle: request.body.gametitle,
      description: request.body.description,
      image: request.file?.path,
      selectsubscription: [request.body.selectsubscription]
    }

    Games.create(game)
    .then(item => response.json(item))
    .catch(error => response.status(400).json({ error: error.message }));
}

module.exports.update = (request, response) => {

  const game = {
    gametitle: request.body.gametitle,
    description: request.body.description,
    image: request.file?.path,
    selectsubscription: request.body.selectsubscription
  }

    Games.findByIdAndUpdate(request.params.id, game, { new: true })
    .then(item => response.json(item))
    .catch(error => response.status(400).json({ error: error.message }));
}

module.exports.find = (request, response) => {
  Games.findOne({ _id: request.params.id })
  .then(item => response.json(item.filter(item => !item.deletedAt)))
  .catch(error => response.status(400).json({ error: error.message }));
}
  

module.exports.findall = (request, response) => {
  Games.find()
  .then(item => response.json(item.filter(item => !item.deletedAt)))
  .catch(error => response.status(400).json({ error: error.message })); 
}

exports.destroy = (request, response) => {
  Games.findByIdAndUpdate(request.params.id, {
      deletedAt: new Date().toLocaleString(),
  })
  .then(() => response.json(request.params.id))
  .catch(error => response.status(400).json({ error: error.message }));
}
   