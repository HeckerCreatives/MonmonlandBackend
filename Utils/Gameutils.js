const Communityactivity = require("../Models/Communityactivity")
const Ads = require("../Models/Ads")
const Gameactivity = require("../Models/Gameactivity")
const Investorfunds = require("../Models/Investorfunds")
const Monmoncoin = require("../Models/Monmoncoin")
const { default: mongoose } = require("mongoose")

exports.addtototalfarmmc = async (mcfarm, mgfarm) => {
    const ads = await Ads.findOne()
    .then(data => data.amount)
    .catch(() => "bad-request")

    const investor = await Investorfunds.findOne()
    .then(data => data.amount)
    .catch(() => "bad-request")

    const gameactmg = await Gameactivity.findOne()
    .then(data => data.initial)
    .catch(() => "bad-request")

    const gameactmc = await Gameactivity.findOne()
    .then(data => data.total)
    .catch(() => "bad-request")

    const comact = await Communityactivity.find({$or: [
        {
            type: "grinding"
        },
        {
            type: "quest"
        },
        {
            type: "monstergem"
        }
    ]})
    .then(data => data)
    .catch(() => "bad-request")

    const monmoncoins = await Monmoncoin.findOne({name: "Monster Coin"})
    .then(data => data.amount)
    .catch(() => "bad-request")

    const mongem = await Monmoncoin.findOne({name: "Monster Gem"})
    .then(data => data.amount)
    .catch(() => "bad-request")

    let maxamount = 0
    let maxmgamount = 0

    comact.forEach(comactdata => {
        const { amount } = comactdata

        if (comactdata.type == "grinding" || comactdata.type == "quest"){
            maxamount += amount
        }
        else if (comactdata.type == "monstergem"){
            maxmgamount += amount
        }
    })

    maxamount += ads
    maxamount += investor
    maxamount += gameactmc
    maxamount *= 1000

    maxmgamount += gameactmg

    const remainingSpace = maxamount - monmoncoins;
    const remainingmgSpace = maxmgamount - mongem;
    let mctobeadded = 0
    let mgtobeadded = 0

    if (mcfarm <= remainingSpace) {
        mctobeadded = mcfarm; // Return the added value
    }
    else {
        mctobeadded = remainingSpace; // Return the remaining space
    }

    if (mgfarm <= remainingmgSpace){
        mgtobeadded = mgfarm
    }
    else{
        mgtobeadded = remainingmgSpace
    }

    await Monmoncoin.findOneAndUpdate({name: "Monster Gem"}, [{
        $set: {
            amount: {
                $min: [maxmgamount, {
                    $add: ["$amount", mgfarm]
                }]
            }
        }
    }])

    return await Monmoncoin.findOneAndUpdate({name: "Monster Coin"}, [{
        $set: {
            amount: {
                $min: [maxamount, {
                    $add: ["$amount", mcfarm]
                }]
            }
        }
    }])
    .then(() => {
        return {message: "success", mctobeadded: mctobeadded.toFixed(5), mgtobeadded: mgtobeadded.toFixed(5)}
    })
    .catch(() => {
        return {message: "bad-request", }
    })
}