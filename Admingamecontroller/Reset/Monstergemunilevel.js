const { default: mongoose } = require("mongoose");
const { connecttodatabase, closedatabase } = require("../../Utils/utils")
const moment = require("moment")
const { parentPort } = require('worker_threads')

parentPort.on('message', async (data) => {
    console.log("STARTING CONVERT MONSTER GEM UNILEVEL TO USERS")

    if(data !== "monstergemunilevel"){
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
          const pooldetails = database.collection("pooldetails")
          
          let monstercoinBulkWrite = []
          let monstercoinHistoryBulkWrite = []

  
      const playerlist = [
        {
          $match: {
            subscription: { $in: ['Pearl', 'Ruby', 'Emerald', 'Diamond'] }
          },
        },
        {
          $lookup: {
            from: 'gameusers', // The name of the 'GameUsers' collection in your database
            localField: 'owner',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: '$userDetails',
        },
        {
          $lookup: {
            from: 'gamewallets', // The name of the 'GameWallet' collection in your database
            localField: 'userDetails._id',
            foreignField: 'owner',
            as: 'walletDetails',
          },
        },
        {
          $unwind: '$walletDetails',
        },
        {
          $match: {
            $or: [
              { 'walletDetails.wallettype': 'monstercoin' },
              { 'walletDetails.wallettype': 'monstergemfarm' },
              { 'walletDetails.wallettype': 'monstergemunilevel' },
            ],
            'walletDetails.amount': { $gt: 0 },
          },
        },
        {
          $project: {
            _id: 0, // Exclude the _id field from the result
            owner: '$userDetails._id',
            username: '$userDetails.username',
            subscription: '$subscription',
            wallettype: '$walletDetails.wallettype',
            amount: '$walletDetails.amount',
          },
        },
    ];
  
    const subscriberlist = pooldetails.aggregate(playerlist)
  
    const subslistusers = await subscriberlist.toArray()
  
    let totalmcfarmed = 0
    let totalmgfarmed = 0
  
    subslistusers.forEach(data => {
  
      //  CONVERT MGUNILVL TO BALANCE
      if (data.subscription != "Pearl"){
        if (data.wallettype == "monstergemunilevel"){
          totalmgfarmed += data.amount
          monstercoinBulkWrite.push({
            updateOne: {
              filter: { owner: new mongoose.Types.ObjectId(data.owner), wallettype: "balance"},
              update: {
                $inc: { amount: data.amount }
              }
            }
          })
        }
      }
  
      //  RESET TO ZERO
  
      
      if (data.wallettype == "monstergemunilevel"){
        monstercoinBulkWrite.push({
          updateOne: {
            filter: { owner: new mongoose.Types.ObjectId(data.owner), wallettype: "monstergemunilevel"},
            update: { $set: { amount: 0 } }
          }
        })
      }
  
      if (data.subscription != "Pearl"){
        if (data.wallettype == "monstergemunilevel"){
          monstercoinHistoryBulkWrite.push({
            insertOne: {
              document: {
                owner: new mongoose.Types.ObjectId(data.owner),
                type: "Monster Gem Unilevel Convert",
                description: "Monster Gem Unilevel Convert",
                amount: data.amount,
                historystructure: `MG: ${data.amount}`,
                createdAt: createdat
              }
            }
          })
        }
      }
    })
  
    if (monstercoinBulkWrite.length > 0){
      await gamewallets.bulkWrite(monstercoinBulkWrite)
    }
  
    if (monstercoinHistoryBulkWrite.length > 0){
      await wallethistory.bulkWrite(monstercoinHistoryBulkWrite)
    }
  
  
      parentPort.postMessage({message: "success", data: "Monster Gem Unilevel Convertion Complete"})
      await closedatabase()
      return
  
    } catch (error) {
      console.error('Error during MongoDB operations:', error);
      parentPort.postMessage({message: "failed", data: error})
      await closedatabase();
      return
    }
})