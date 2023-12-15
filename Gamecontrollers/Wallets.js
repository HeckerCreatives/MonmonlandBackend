const Wallets = require('../Gamemodels/Wallets')

exports.find = (req, res) => {
    const { id } = req.body

    Wallets.find({owner: id})
    .then(data => {
        const personalpoints = data.find(e => e.wallettype === "personalpoints")
        const adspoints = data.find(e => e.wallettype === "adspoints")
        const purchasepoints = data.find(e => e.wallettype === "purchasepoints")
        const taskpoints = data.find(e => e.wallettype === "taskpoints")
        const recruitpoints = data.find(e => e.wallettype === "recruitpoints")
        const totalpoints = data.find(e => e.wallettype === "totalpoints")
        const monstergem = data.find(e => e.wallettype === "monstergem")
        const monstercoin = data.find(e => e.wallettype === "monstercoin")
        const balance = data.find(e => e.wallettype === "balance")
        const totalincome = data.find(e => e.wallettype === "totalincome")

        const summary = {
            "personalpoints": personalpoints.amount,
            "adspoints": adspoints.amount,
            "purchasepoints": purchasepoints.amount,
            "taskpoints": taskpoints.amount,
            "recruitpoints": recruitpoints.amount,
            "totalpoints": totalpoints.amount,
            "monstergem": monstergem.amount,
            "monstercoin": monstercoin.amount,
            "balance": balance.amount,
            "totalincome": totalincome.amount
        }

        res.json({message: "success", data: summary})
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}