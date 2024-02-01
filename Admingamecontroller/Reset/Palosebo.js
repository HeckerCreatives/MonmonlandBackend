const { default: mongoose } = require("mongoose");
const { connecttodatabase, closedatabase } = require("../../Utils/utils")
const moment = require("moment")
const { parentPort } = require('worker_threads')

parentPort.on('message', async (data) => {
    console.log("STARTING CONVERT PALOSEBO MONSTER COIN TO USERS")

    if(data !== "palosebo"){
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

        const monstercoinBulkWrite = []
        const monstercoinHistoryBulkWrite = []

        const fiestas = database.collection("fiestas")
        const prizepool = database.collection("prizepools")
        const paloseboprizepool = await prizepool.findOne({type: "palosebo"})
        const palosebopool = paloseboprizepool.amount

    const palosebolbpipeline = [
        {
          $match: {
            type: "palosebo",
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

      const palosebolb = fiestas.aggregate(palosebolbpipeline)
      const palosebolbdata = await palosebolb.toArray()

      let palosebolbindex = 0;
      let palosebolpercentage = 0;

      palosebolbdata.forEach(data => {
        switch(palosebolbindex){
          case 0:
            palosebolpercentage = 0.25
          break;
          case 1:
            palosebolpercentage = 0.20
          break;
          case 2:
            palosebolpercentage = 0.15
          break;
          case 3:
            palosebolpercentage = 0.10
          break;
          case 4:
            palosebolpercentage = 0.05
          break;
          case 5:
            palosebolpercentage = 0.03
          break;
          case 6:
            palosebolpercentage = 0.02
          break;
          case 7:
            palosebolpercentage = 0.01
          break;
          case 8:
            palosebolpercentage = 0.01
          break;
          case 9:
            palosebolpercentage = 0.01
          break;
          default:
            palosebolpercentage = 0
          break;
        }

        monstercoinBulkWrite.push({
          updateOne: {
            filter: { owner: new mongoose.Types.ObjectId(data._id), wallettype: "monstercoin"},
            update: {
              $inc: { amount: palosebopool * palosebolpercentage }
            }
          }
        })

        monstercoinHistoryBulkWrite.push({
          insertOne: {
            document: {
              owner: new mongoose.Types.ObjectId(data._id),
              type: "Leaderboard Palosebo Convert",
              description: "Leaderboard Palosebo Convert",
              amount: palosebopool * palosebolpercentage,
              historystructure: `Leaderboard Palosebo Value: ${palosebopool}, to be added: ${palosebopool * palosebolpercentage}, value used to convert ${palosebolpercentage}`,
              createdAt: createdat
            }
          }
        })

        palosebolbindex++
      })

      //  THIS IS FOR FIESTA LEADERBOARD
      if (monstercoinBulkWrite.length > 0){
        await gamewallets.bulkWrite(monstercoinBulkWrite)

      }

      if (monstercoinHistoryBulkWrite.length > 0){
        await wallethistory.bulkWrite(monstercoinHistoryBulkWrite)

      }

        await fiestas.updateMany({type: "palosebo"}, { $set: { amount: 0 } })
        await prizepool.updateOne({type: "palosebo"}, { $set: { amount: 0 } })

        parentPort.postMessage({message: "success", data: "Palosebo Convertion Complete"})
        await closedatabase()
        return
    } catch (error) {
      console.error('Error during MongoDB operations:', error);
      parentPort.postMessage({message: "failed", data: error})
      await closedatabase();
      return
    }
    
})