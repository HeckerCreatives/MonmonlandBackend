const Wallets = require('../Gamemodels/Wallets')
const Communityactivity = require("../Models/Communityactivity")
const Monmoncoin = require("../Models/Monmoncoin")
const Gameactivity = require("../Models/Gameactivity")
const Ads = require("../Models/Ads")
const Investorfunds = require("../Models/Investorfunds")
exports.find = async (req, res) => {
    
    Wallets.find({owner: req.user.id})
    .then(async data => {

        const mcvalue = await Monmoncoin.findOne({ name: "Monster Coin" })
        .then(async mc => {
            const ads = await Ads.findOne().then(data => {
            return data.amount;
            });

            const investor = await Investorfunds.findOne().then(data => {
            return data.amount;
            });

            try {
            const header = await Gameactivity.findOne();
            const grind = await Communityactivity.findOne({ type: "grinding" });
            const quest = await Communityactivity.findOne({ type: "quest" });

            const value = grind.amount + quest.amount + header.total + ads + investor;
            const fnal = value / mc.amount;
            return fnal;
            } catch (error) {
            console.error("Error in findOne calls:", error);
            throw error; // Re-throw the error to be caught by the outer catch block
            }
        })
        .catch(error => res.status(500).json({ message: "failed", data: error.message }));


        const activitypoints = data.find(e => e.wallettype === "activitypoints")
        const adspoints = data.find(e => e.wallettype === "adspoints")
        const purchasepoints = data.find(e => e.wallettype === "purchasepoints")
        const taskpoints = data.find(e => e.wallettype === "taskpoints")
        const recruitpoints = data.find(e => e.wallettype === "recruitpoints")
        const totalpoints = data.find(e => e.wallettype === "totalpoints")
        const monstergemfarm = data.find(e => e.wallettype === "monstergemfarm")
        const monstergemunilevel = data.find(e => e.wallettype === "monstergemunilevel")
        const monstercoin = data.find(e => e.wallettype === "monstercoin")
        const balance = data.find(e => e.wallettype === "balance")
        const totalincome = data.find(e => e.wallettype === "totalincome")
        const subscriberincome = (monstercoin.amount * mcvalue)
        const summary = {
            "activitypoints": activitypoints.amount,
            "adspoints": adspoints.amount,
            "purchasepoints": purchasepoints.amount,
            "taskpoints": taskpoints.amount,
            "recruitpoints": recruitpoints.amount,
            "totalpoints": totalpoints.amount,
            "monstergemfarm": monstergemfarm.amount,
            "monstergemunilevel": monstergemunilevel.amount,
            "monstercoin": monstercoin.amount,
            "balance": balance.amount,
            "totalincome": totalincome.amount,
            "subscriberincome": subscriberincome
        }

        res.json({message: "success", data: summary})
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}