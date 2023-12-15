const Playerdetails = require("../Gamemodels/Playerdetails")


exports.find = (req, res) => {
    const { id } = req.body

    Playerdetails.findOne({owner: id})
    .then(data => {
        console.log(data)
        res.json({message: "success", data: data})
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.update = (req, res) => {
    const { id, email, phone } = req.body

    Playerdetails.findOneAndUpdate({owner: id}, {email: email, phone: phone}, {new: true})
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}