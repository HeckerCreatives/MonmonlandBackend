const { default: mongoose } = require("mongoose");
const { connecttodatabase, closedatabase } = require("../../Utils/utils")
const moment = require("moment")
const { parentPort } = require('worker_threads')



parentPort.on('message', async (data) => {
    console.log("STARTING RESET GRINDING WITH MAX ENERGY TO USERS")

    if(data !== "resetgrindingwithmaxenergy"){
      parentPort.postMessage({message: "failed", data: "Run Task Not Found"})
      return
    }

    try{
        const client = await connecttodatabase();
        const database = client.db()

        const pooldetails = database.collection("pooldetails")
        const energy = database.collection("energy")

        const pooldeetslist = pooldetails.find();
        const pooldeetsdata = await pooldeetslist.toArray()

        const energyBulkWrite = []

        pooldeetsdata.forEach(data => {
            let finalmaxenergy = 0;

            switch(data.subscription){
                case "Pearl":
                    finalmaxenergy = 20
                    break;
                case "Ruby":
                    finalmaxenergy = 80
                    break;
                case "Emerald":
                    finalmaxenergy = 130
                    break;
                case "Diamond":
                    finalmaxenergy = 180
                    break;
                default:
                    finalmaxenergy = 0
                    break;
            }

            energyBulkWrite.push({
                updateOne: {
                    filter: {owner: new mongoose.Types.ObjectId(data.owner)},
                    update: { $set: { amount: finalmaxenergy } }
                }
            })
        })

        await energy.bulkWrite(energyBulkWrite)
        

        parentPort.postMessage({message: "success", data: "Max Energy Reset Complete"})
        await closedatabase()
        return
    }
    catch(error){
        console.error('Error during MongoDB operations:', error);
        parentPort.postMessage({message: "failed", data: error})
        await closedatabase();
        return
    }

})