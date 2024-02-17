const { default: mongoose } = require("mongoose");
const { connecttodatabase, closedatabase } = require("../../Utils/utils")
const moment = require("moment")
const { parentPort } = require('worker_threads')

parentPort.on('message', async (data) => {
    console.log("STARTING CONVERT MONSTER COIN TO USERS")
    console.log(data)
    if(data !== "monstercoin"){
      parentPort.postMessage({message: "failed", data: "Run Task Not Found"})
      return
    }

    try {
      let client
      let database

      client = await connecttodatabase();
      database = client.db()

          const createdat = new Date(moment(new Date(), 'MM/DD/YYYY HH:mm:ss').toISOString(true))
  
          const monmoncoin = database.collection("monmoncoins")
          const ads = database.collection("ads")
          const investors = database.collection("investorfunds")
          const gameactivity = database.collection("gameactivities")
          const communityactivity = database.collection("communityactivities")
          const wallethistory = database.collection("wallethistories")
          const gamewallets = database.collection("gamewallets")
          const mchistory = database.collection("mchistories")
          const ingamegame = database.collection("ingamegames")
  
          const totalmcval = await monmoncoin.findOne({name: "Monster Coin"})
          const adsval = await ads.findOne()
          const investorval = await investors.findOne()
          const gameactivityval = await gameactivity.findOne()
          const communityval = communityactivity.find()
          
          const finalcommunityval = await communityval.toArray()
  
          const grinding = finalcommunityval.filter(e => e.type == "grinding")
          const quest = finalcommunityval.filter(e => e.type == "quest")

          const mclimit =  grinding[0].amount + quest[0].amount + gameactivityval.total + adsval.amount + investorval.amount
  
          const mcvalue = mclimit / (totalmcval.amount == 0 ? 1 : totalmcval.amount)
  
          const pooldetails = database.collection("pooldetails")
          
          let monstercoinBulkWrite = []
          let monstercoinHistoryBulkWrite = []
  

      const playerlist = [
        {
          $match: {
            subscription: { $in: ['Pearl', 'Pearlplus', 'Ruby', 'Emerald', 'Diamond'] }
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

      //  CONVERT MC TO BALANCE
      if (data.subscription != "Pearl"){
        if (data.wallettype == "monstercoin"){
          totalmcfarmed += data.amount
          monstercoinBulkWrite.push({
            updateOne: {
              filter: { owner: new mongoose.Types.ObjectId(data.owner), wallettype: "balance"},
              update: {
                $inc: { amount: data.amount * mcvalue }
              }
            }
          })
        }
      }

      //  RESET TO ZERO
      if (data.wallettype == "monstercoin"){
        monstercoinBulkWrite.push({
          updateOne: {
            filter: { owner: new mongoose.Types.ObjectId(data.owner), wallettype: "monstercoin"},
            update: { $set: { amount: 0 } }
          }
        })
      }

      if (data.subscription != "Pearl"){
        if (data.wallettype == "monstercoin"){
          monstercoinHistoryBulkWrite.push({
            insertOne: {
              document: {
                owner: new mongoose.Types.ObjectId(data.owner),
                type: "Monster Coin Convert",
                description: "Monster Coin Convert",
                amount: data.amount * mcvalue,
                historystructure: `MC: ${data.amount}, to be added: ${data.amount * mcvalue}, value used to convert ${mcvalue}`,
                createdAt: createdat
              }
            }
          })
        }
      }
      else{
        if (data.wallettype == "monstercoin"){
          monstercoinHistoryBulkWrite.push({
            insertOne: {
              document: {
                owner: new mongoose.Types.ObjectId(data.owner),
                type: "Missed Monster Coin Convert",
                description: "Missed Monster Coin Convert",
                amount: data.amount * mcvalue,
                historystructure: `MC: ${data.amount}, predicted to be added: ${data.amount * mcvalue}, value used to convert ${mcvalue}`,
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

    
    await monmoncoin.bulkWrite([{
      updateOne: {
        filter: { name: "Monster Coin"},
        update: { $set: { amount: 0 } }
      }
    }])

    await communityactivity.bulkWrite([{
      updateOne: {
        filter: { type: "grinding" },
        update: { $set: { amount: 0 } }
      },
      updateOne: {
        filter: { type: "quest" },
        update: { $set: { amount: 0 } }
      },
    }])

    await mchistory.insertOne({amount: mcvalue, leaderboardamount: 0, grindingamount: grinding[0].amount, questamount: quest[0].amount, totalmcfarmed: totalmcfarmed, totalmgfarmed: totalmgfarmed, createdAt: createdat})

    await ingamegame.updateMany({}, { $set: { status: "pending", timestarted: 0, unixtime: 0, harvestmc: 0, harvestmg: 0, harvestap: 0}})

    parentPort.postMessage({message: "success", data: "Monster Coin Convertion Complete"})
    await closedatabase()
    return

    } catch (error) {
      console.error('Error during MongoDB operations:', error);
      parentPort.postMessage({message: "failed", data: error})
      await closedatabase();
      return
    }
})