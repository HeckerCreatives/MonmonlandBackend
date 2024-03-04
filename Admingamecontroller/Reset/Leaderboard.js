const { default: mongoose } = require("mongoose");
const { connecttodatabase, closedatabase } = require("../../Utils/utils")
const moment = require("moment")
const { parentPort } = require('worker_threads')

parentPort.on('message', async (data) => {
    console.log("STARTING CONVERT LEADERBOARD TO USERS")

    if(data !== "leaderboard"){
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
      const lbhistory = database.collection("leaderboardhistories")
      const gamewallets = database.collection("gamewallets")
      const communityactivity = database.collection("communityactivities")
      const leaderboard = database.collection("ingameleaderboards")
      const walletscutoff = database.collection("walletscutoffs")
  
      const communityval = communityactivity.find()
      
      const finalcommunityval = await communityval.toArray()
  
      const leaderboardval = finalcommunityval.filter(e => e.type == "leaderboard")
  
  
      let monstercoinBulkWrite = []
      let monstercoinHistoryBulkWrite = []
  
      const lbpipeline = [
          {
              $match: {
                  wallettype: "directpoints",
                  amount: { $gte: 1 }
              }
          },
          {
              $lookup: {
                  from: "ingameleaderboards", // Use the actual collection name of Ingameleaderboard
                  localField: "owner",
                  foreignField: "owner",
                  as: "leaderboardData"
              }
          },
          {
              $unwind: "$leaderboardData"
          },
          {
              $lookup: {
                  from: "gameusers", // Assuming User is the collection name for your User model
                  localField: "owner",
                  foreignField: "_id",
                  as: "userData"
              }
          },
          {
              $unwind: "$userData"
          },
          {
              $sort: {
                  "leaderboardData.amount": -1
              }
          },
          {
              $limit: 15
          },
          {
              $project: {
                  _id: 0, // Exclude _id field
                  owner: "$leaderboardData.owner",
                  username: "$userData.username", // Access the username through userData
                  amount: "$leaderboardData.amount"
                  // Add more fields if needed
              }
          }    
      ]
  
      const leaderboardlist = await walletscutoff.aggregate(lbpipeline)
      const leaderboarduserlist = await leaderboardlist.toArray()
      
      let leaderboardindex = 0;
      let percentage = 0
  
      leaderboarduserlist.forEach(data => {
        switch(leaderboardindex){
          case 0:
            percentage = 0.25
          break;
          case 1:
            percentage = 0.20
          break;
          case 2:
            percentage = 0.15
          break;
          case 3:
            percentage = 0.10
          break;
          case 4:
            percentage = 0.08
          break;
          case 5:
            percentage = 0.05
          break;
          case 6:
            percentage = 0.04
          break;
          case 7:
            percentage = 0.03
          break;
          case 8:
            percentage = 0.02
          break;
          case 9:
            percentage = 0.02
          break;
          case 10:
            percentage = 0.02
          break;
          case 11:
            percentage = 0.01
          break;
          case 12:
            percentage = 0.01
          break;
          case 13:
            percentage = 0.01
          break;
          case 14:
            percentage = 0.01
          break;
          default:
            percentage = 0
          break;
        }
  
        monstercoinBulkWrite.push({
          updateOne: {
            filter: { owner: new mongoose.Types.ObjectId(data.owner), wallettype: "balance"},
            update: {
              $inc: { amount: leaderboardval[0].amount * percentage }
            }
          }
        })
  
        monstercoinHistoryBulkWrite.push({
          insertOne: {
            document: {
              owner: new mongoose.Types.ObjectId(data.owner),
              type: "Leaderboard Convert",
              description: "Leaderboard Convert",
              amount: leaderboardval[0].amount * percentage,
              historystructure: `Leaderboard Value: ${leaderboardval[0].amount}, to be added: ${leaderboardval[0].amount * percentage}, value used to convert ${percentage}`,
              createdAt: createdat
            }
          }
        })
  
        leaderboardindex++;
      })
  
      await  communityactivity.bulkWrite([{
        updateOne: {
          filter: { type: "leaderboard" },
          update: { $set: { amount: 0 } }
        }
      }])

      await lbhistory.insertOne({
          owner: new mongoose.Types.ObjectId(leaderboarduserlist[0].owner),
          amount: leaderboarduserlist[0].amount,
          createdAt: createdat
      })

      if (monstercoinBulkWrite.length > 0){
        await gamewallets.bulkWrite(monstercoinBulkWrite)
      }
  
      if (monstercoinHistoryBulkWrite.length > 0){
        await wallethistory.bulkWrite(monstercoinHistoryBulkWrite)
      }


  
      await walletscutoff.updateMany({}, { $set: { amount: 0 } })
      await leaderboard.updateMany({}, { $set: { amount: 0 } })
      
      parentPort.postMessage({message: "success", data: "Leaderboard Convertion Complete"})
      await closedatabase()
      return
    } catch (error) {
      console.error('Error during MongoDB operations:', error);
      parentPort.postMessage({message: "failed", data: error})
      await closedatabase();
      return
    }
})