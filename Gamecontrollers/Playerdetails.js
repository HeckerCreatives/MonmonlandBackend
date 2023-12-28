const Playerdetails = require("../Gamemodels/Playerdetails")


exports.find = (req, res) => {
    // const { id } = req.body

    Playerdetails.findOne({owner: req.user.id})
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.update = (req, res) => {
    const {  email, phone } = req.body

    Playerdetails.findOneAndUpdate({owner: req.user.id}, {email: email, phone: phone}, {new: true})
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}