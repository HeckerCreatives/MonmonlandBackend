const { response } = require("express");
const Gameactivity = require("../Models/Gameactivity");
const GameactivityHistory = require("../Models/GameactivityHistory");

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
    const { value, enteredamount, createdby } = request.body;
    const { id } = request.params;
  
    const history = {
      barId: id,
      value: value,
      enteredamount: enteredamount,
      createdby: createdby
    };
  
    Gameactivity.findByIdAndUpdate(id, request.body, { new: true })
      .then((updatedData) => {
        // Check if the Gameactivity was successfully updated
        if (updatedData) {
          // Create the GameactivityHistory entry
          GameactivityHistory.create(history)
            .then(() => response.json(updatedData))
            .catch((error) => response.status(400).json({ error: error.message }));
        } else {
          response.status(404).json({ error: "Gameactivity not found" });
        }
      })
      .catch((error) => response.status(400).json({ error: error.message }));
  };
  

module.exports.getall = (request, response) => {
    Gameactivity.find()
    .then(data => response.send(data))
    .catch(error => response.send(error))
}

module.exports.gethistory = (request, response) => {
    GameactivityHistory.find()
    .then(data => response.send(data))
    .catch(error => response.send(error))
}

module.exports.getprogress = async (req, res) => {
try {
  const initial = await GameactivityHistory.find({value: "Initial"}).sort({createdAt: -1})
  const target = await GameactivityHistory.find({value: "Target"}).sort({createdAt: -1})

  const progress = {
    initial: initial[0].enteredamount,
    target: target[0].enteredamount
  }

  res.json(progress)
} catch (error) {
  res.status(500).json({ error: 'Something went wrong' });
}


}