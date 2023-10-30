const Communityactivity = require("../Models/Communityactivity")
const Monmoncoin = require("../Models/Monmoncoin")
const Gameactivity = require("../Models/Gameactivity")

exports.mcvalue= (req, res) => {

    Monmoncoin.findOne({name: "Monster Coin"})
    .then(async mc => {

       await Gameactivity.findOne()
       .then( header => {
            Communityactivity.find({type: "grinding"})
            .then(grind => {
                Communityactivity.find({type: "quest"})
                .then(quest => {
                    const value = grind.amount + quest.amount + header.total
                    const fnal = value / mc.amount

                    res.json({message: "success", data: fnal})
                })
                .catch((error) => res.status(500).json({ error: error.message }));
            })
            .catch((error) => res.status(500).json({ error: error.message }));
       })
       .catch((error) => res.status(500).json({ error: error.message }));

    })
    .catch((error) => res.status(500).json({ error: error.message }));
}