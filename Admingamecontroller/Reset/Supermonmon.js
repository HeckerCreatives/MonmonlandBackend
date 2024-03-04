const { default: mongoose } = require("mongoose");
const { connecttodatabase, closedatabase } = require("../../Utils/utils")
const moment = require("moment")
const { parentPort } = require('worker_threads')


parentPort.on('message', async (data) => {
    console.log("STARTING CONVERT SUPERMONMON MONSTER COIN TO USERS")
    
    if(data !== "supermonmon"){
      parentPort.postMessage({message: "failed", data: "Run Task Not Found"})
      return
    }

    try {
      let client
      let database

      client = await connecttodatabase();
      database = client.db()

        const createdat = new Date(moment(new Date(), 'MM/DD/YYYY HH:mm:ss').toISOString(true))
        const wallethistory = database.collection("wallethistories")
        const gamewallets = database.collection("gamewallets")
        const supermonmonhistory = database.collection("fiestahistories")
        const monstercoinBulkWrite = []
        const monstercoinHistoryBulkWrite = []

        const fiestas = database.collection("fiestas")
        const prizepool = database.collection("prizepools")
        const smmprizepool = await prizepool.findOne({type: "supermonmon"})

        const smmpool = smmprizepool.amount

        const smmlbpipeline = [
          {
            $match: {
              type: "supermonmon",
              amount: { $gt: 0 }
            }
          },
          {
            $lookup: {
              from: "gameusers",  // Assuming your collection name is "gameusers"
              localField: "owner",
              foreignField: "_id",
              as: "user"
            }
          },
          {
            $unwind: "$user"
          },
          {
            $sort: {
              "amount": -1  // Sort in descending order based on the amount
            }
          },
          {
            $limit: 10  // Limit the result to the top 15 users
          },
          {
            $project: {
              _id: "$user._id",
              username: "$user.username",
              amount: 1  // Include other fields as needed
            }
          }
        ]

        const smmlb = await fiestas.aggregate(smmlbpipeline)
        const smmlbdata = await smmlb.toArray();

        let smmlbindex = 0;
        let smmlpercentage = 0;

        smmlbdata.forEach(data => {
          switch(smmlbindex){
            case 0:
              smmlpercentage = 0.25
            break;
            case 1:
              smmlpercentage = 0.20
            break;
            case 2:
              smmlpercentage = 0.15
            break;
            case 3:
              smmlpercentage = 0.10
            break;
            case 4:
              smmlpercentage = 0.05
            break;
            case 5:
              smmlpercentage = 0.03
            break;
            case 6:
              smmlpercentage = 0.02
            break;
            case 7:
              smmlpercentage = 0.01
            break;
            case 8:
              smmlpercentage = 0.01
            break;
            case 9:
              smmlpercentage = 0.01
            break;
            default:
              smmlpercentage = 0
            break;
          }

          monstercoinBulkWrite.push({
            updateOne: {
              filter: { owner: new mongoose.Types.ObjectId(data._id), wallettype: "monstercoin"},
              update: {
                $inc: { amount: smmpool * smmlpercentage }
              }
            }
          })

          monstercoinHistoryBulkWrite.push({
            insertOne: {
              document: {
                owner: new mongoose.Types.ObjectId(data._id),
                type: "Leaderboard Supermonmon Convert",
                description: "Leaderboard Supermonmon Convert",
                amount: smmpool * smmlpercentage,
                historystructure: `Leaderboard Supermonmon Value: ${smmpool}, to be added: ${smmpool * smmlpercentage}, value used to convert ${smmlpercentage}`,
                createdAt: createdat
              }
            }
          })

          smmlbindex++
        })

        await supermonmonhistory.insertOne({
            owner: new mongoose.Types.ObjectId(smmlbdata[0]._id),
            type: "supermonmon",
            amount: smmlbdata[0].amount,
            createdAt: createdat
        })

        //  THIS IS FOR FIESTA LEADERBOARD
        if (monstercoinBulkWrite.length > 0){
            await gamewallets.bulkWrite(monstercoinBulkWrite)
        }
        if (monstercoinHistoryBulkWrite.length > 0){
            await wallethistory.bulkWrite(monstercoinHistoryBulkWrite)
        }

        await fiestas.updateMany({type: "supermonmon"}, { $set: { amount: 0 } })
        await prizepool.updateOne({type: "supermonmon"}, { $set: { amount: 0 } })

        parentPort.postMessage({message: "success", data: "Supermonmon Convertion Complete"})
        await closedatabase()
        return
    } catch (error) {
      console.error('Error during MongoDB operations:', error);
      parentPort.postMessage({message: "failed", data: error})
      await closedatabase();
      return
    }

})









