const { default: mongoose } = require("mongoose");
const Merchandise = require("../Models/Merchandise")
const Communityactivity = require("../Models/Communityactivity")

exports.computecomplan = async (amount) => {

    let response = ""
                
    const complan = (amount * 0.40)
    const leaderboards = (amount * 0.02)
    const grinding = (amount * 0.20)
    const monstergem = (amount * 0.15)
    const diamondpools = (amount * 0.01)
    const incentives = (amount * 0.03)
    const marketing = (amount * 0.02)
    const investorfunds = (amount * 0.02)
    const officers = (amount * 0.08)
    const devsshare = (amount * 0.05)
    const companyshare = (amount * 0.02)

    const bulkOperations = [
        {
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(process.env.leaderboardsca)},
                update: { $inc: { amount: leaderboards }}
            }
        },
        {
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(process.env.grindingca)},
                update: { $inc: { amount: grinding }}
            }
        },
        {
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(process.env.diamondpoolsca)},
                update: { $inc: { amount: diamondpools }}
            }
        },
        {
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(process.env.devsshareca)},
                update: { $inc: { amount: devsshare }}
            }
        },
        {
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(process.env.companyshareca)},
                update: { $inc: { amount: companyshare }}
            }
        },
        {
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(process.env.officersca)},
                update: { $inc: { amount: officers }}
            }
        },
        {
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(process.env.marketingca)},
                update: { $inc: { amount: marketing }}
            }
        },
        {
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(process.env.incentivesca)},
                update: { $inc: { amount: incentives }}
            }
        },
        {
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(process.env.monstergemca)},
                update: { $inc: { amount: monstergem }}
            }
        },
        {
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(process.env.investorfundsca)},
                update: { $inc: { amount: investorfunds }}
            }
        },
        {
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(process.env.complanpayin)},
                update: { $inc: { amount: complan }}
            }
        }
    ]

    await Communityactivity.bulkWrite(bulkOperations)
    .catch(err => {
        response = "bad-request"
        console.log(err.message)
        return
    })

    response = "success"

    return response
}