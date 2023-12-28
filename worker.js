const { parentPort } = require('worker_threads')

const moment = require('moment');
const bcrypt = require('bcrypt')
var playfab = require('playfab-sdk')
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
PlayFab.settings.titleId = process.env.monmontitleid;
const { connectToDatabase } = require('./db')

const encrypt = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

parentPort.on('message', async (message) => {
    const username = message[0]
    const password =  message[1]
    const playfabToken = message[2]
    const thetime = message[3]
    const desiredDate = new Date('Fri Dec 29 2023 00:00:00 GMT+0800');
    const currentdatetime = new Date(thetime)
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'GMT',
        timeZoneName: 'short'
    };
    const formateddate = currentdatetime.toLocaleString('en-US', options)

    if(formateddate < desiredDate){
       return parentPort.postMessage({message: "failed", data: "Opps! Sorry You Can't Do That"})
    }

    PlayFab._internalSettings.sessionTicket = playfabToken;
    PlayFabClient.ExecuteCloudScript({
        FunctionName: "MigrationData",
        ExecuteCloudScript: true,
        GeneratePlayStreamEvent: true,
    }, async (error1, result1) => {
        if(result1){
            const db = await connectToDatabase();
            const Gameusers = db.collection('gameusers')
            const Playerdetails = db.collection('playerdetails')
            const Pooldetails = db.collection('pooldetails')
            const Walletscutoff = db.collection('walletscutoffs')
            const Gamewallet = db.collection('gamewallets')
            const Equipment = db.collection('equipment')
            const Clock  = db.collection('clocks')
            const Ingamegames = db.collection('ingamegames')
            const Dailyactivities = db.collection('dailyactivities')
            const Energy = db.collection('energy')
            const Playtimegrinding = db.collection('playtimegrindings')
            const Ingameleaderboard = db.collection('ingameleaderboards')
            const Paymentdetails = db.collection('paymentdetails')
            const Cashouthistory = db.collection('cashouthistory')
            const Wallethistory = db.collection('wallethistory')
            const Cosmetics = db.collection('cosmetics')

            const personaldetails = JSON.parse(result1.data.FunctionResult.data.personalDetails.Value)
            const paymentdetails = JSON.parse(result1.data.FunctionResult.data.paymentDetails.Value)
            const wallethistory = JSON.parse(result1.data.FunctionResult.data.walletHistory.Value)
            const payouthistory = JSON.parse(result1.data.FunctionResult.data.payoutHistory.Value)
            const wallets = JSON.parse(result1.data.FunctionResult.data.wallets.Value)
            const poolDetails = JSON.parse(result1.data.FunctionResult.data.poolDetails.Value)
            const cosmetics = JSON.parse(result1.data.FunctionResult.data.softLaunchUser.Value)



            const isMigrated = await Gameusers.findOne({username: username})
            .then(data => {
                if(data){
                    return true
                } else {
                    return false
                }
            })

            if(isMigrated){
                parentPort.postMessage({message: "failed", data: "You already migrated your account"})
                await db.close
                return
            }

            // const newuser = new Gameusers({
            //     username: username,
            //     password: password,
            // })

            let userid
            let pass = await encrypt(password)
            await Gameusers.insertOne({
                username: username,
                password: pass,
                status: "active",
            })
            .then(async data => {
                userid = data.insertedId

                //cosmetics
                if(cosmetics !== null){
                    const data = {
                        owner: userid,
                        name: poolDetails.subscription,
                        type: "ring",
                        expiration: "permanent",
                        isequip: "0"
                    }

                    Cosmetics.insertOne(data)
                }

                //cashouthistory

                // Convert the data into an array of documents
                const cashouthistory = Object.entries(payouthistory)?.map(([key, value]) => {
                    
                    return {
                    owner: userid, // Assuming your '_id' field is an ObjectId
                    amount: value.amount,
                    status: value.status,
                    updatedAt: new Date(),
                    createdAt: moment(value.date, 'MM/DD/YYYY HH:mm:ss').toISOString(true)
                    };
                });

                if(cashouthistory.length !== 0){
                    await Cashouthistory.insertMany(cashouthistory)
                }

                // walletHistory

                const walletHistory = Object.entries(wallethistory)?.map(([key, value]) => {
                    return {
                        owner: userid,
                        type: value.description, // Replace with the actual type value
                        description: value.description,
                        amount: parseFloat(value.amount),
                        // historystructure: 'yourHistoryStructure', // Replace with the actual historystructure value
                        updatedAt: new Date(),
                        createdAt: moment(value.dateTime, 'MM/DD/YYYY HH:mm:ss').toISOString(true)
                    }
                })

                if(walletHistory.length !== 0){
                    await Wallethistory.insertMany(walletHistory)
                }
                

                // playerdetails
                const playerdetails = {
                    owner: userid,
                    phone: personaldetails.phone,
                    email: personaldetails.email
                }
        
                await Playerdetails.insertOne(playerdetails)

                // gamewallet

                const gamewallet = [
                    {
                        owner: userid,
                        wallettype: "activitypoints",
                        amount: 0
                    },  
                    {
                        owner: userid,
                        wallettype: "adspoints",

                    },
                    {
                        owner: userid,
                        wallettype: "purchasepoints",

                    },
                    {
                        owner: userid,
                        wallettype: "taskpoints"
                    },
                    {
                        owner: userid,
                        wallettype: "recruitpoints",
                        amount: wallets.recruitPoints
                    },
                    {
                        owner: userid,
                        wallettype: "totalpoints"
                    },
                    {
                        owner: userid,
                        wallettype: "monstergemfarm",
                        amount: wallets.monsterGem
                    },
                    {
                        owner: userid,
                        wallettype: "monstergemunilevel"
                    },
                    {
                        owner: userid,
                        wallettype: "monstercoin",
                        amount: wallets.monsterCoin
                    },
                    {
                        owner: userid,
                        wallettype: "balance",
                        amount: wallets.balance
                    },
                    {
                        owner: userid,
                        wallettype: "totalincome",
                        amount: wallets.totalIncome
                    },
        
                ]

                await Gamewallet.insertMany(gamewallet)
                
                // pooldetails
                const pooldetails = {
                    owner: userid,
                    status: poolDetails.status,
                    subscription: poolDetails.subscription
                }

                await Pooldetails.insertOne(pooldetails)
        
                // walletcuoff
        
                const walletcutoff = [
                    {
                        owner: userid,
                        wallettype: "activitypoints"
                    },
                    {
                        owner: userid,
                        wallettype: "adspoints"
                    },
                    {
                        owner: userid,
                        wallettype: "purchasepoints"
                    },
                    {
                        owner: userid,
                        wallettype: "taskpoints"
                    },
                    {
                        owner: userid,
                        wallettype: "recruitpoints"
                    },
                    {
                        owner: userid,
                        wallettype: "totalpoints"
                    },
        
                ]
        
                await Walletscutoff.insertMany(walletcutoff)

                // equipment

                const equipment = [
                    {
                        owner: userid,
                        type: "1",
                        isowned: "1",
                        expiration: '0',
                        isequip: '1'
                    },
                    {
                        owner: userid,
                        type: "2",
                        isowned: "0",
                        expiration: '0',
                        isequip: '0'
                    },
                    {
                        owner: userid,
                        type: "3",
                        isowned: "0",
                        expiration: '0',
                        isequip: '0'
                    },
                    {
                        owner: userid,
                        type: "4",
                        isowned: "0",
                        expiration: '0',
                        isequip: '0'
                    },
                    {
                        owner: userid,
                        type: "5",
                        isowned: "0",
                        expiration: '0',
                        isequip: '0'
                    },
        
                ]

                await Equipment.insertMany(equipment)
        
                // clock
        
                const clock = [
                    {
                        owner: userid,
                        type: "1",
                        isowned: "0",
                        expiration: '0',
                        isequip: '0'
                    },
                    {
                        owner: userid,
                        type: "2",
                        isowned: "0",
                        expiration: '0',
                        isequip: '0'
                    },
                    {
                        owner: userid,
                        type: "3",
                        isowned: "0",
                        expiration: '0',
                        isequip: '0'
                    },
                    {
                        owner: userid,
                        type: "4",
                        isowned: "0",
                        expiration: '0',
                        isequip: '0'
                    },
        
                ]

                await Clock.insertMany(clock)
        
                // games
                const games = [
                    {
                        owner: userid,
                        type: "woodcutting",
                        status: 'pending',
                        unixtime: '0',
                        harvestmc: 0,
                        harvestmg: 0,
                        harvestap: 0
                    },
                    {
                        owner: userid,
                        type: "mining",
                        status: 'pending',
                        unixtime: '0',
                        harvestmc: 0,
                        harvestmg: 0,
                        harvestap: 0
                    },
                    {
                        owner: userid,
                        type: "fishing",
                        status: 'pending',
                        unixtime: '0',
                        harvestmc: 0,
                        harvestmg: 0,
                        harvestap: 0
                    },
                    {
                        owner: userid,
                        type: "farming",
                        status: 'pending',
                        unixtime: '0',
                        harvestmc: 0,
                        harvestmg: 0,
                        harvestap: 0
                    },
                    {
                        owner: userid,
                        type: "hunting",
                        status: 'pending',
                        unixtime: '0',
                        harvestmc: 0,
                        harvestmg: 0,
                        harvestap: 0
                    },
                    {
                        owner: userid,
                        type: "crafting",
                        status: 'pending',
                        unixtime: '0',
                        harvestmc: 0,
                        harvestmg: 0,
                        harvestap: 0
                    },
                    {
                        owner: userid,
                        type: "smithing",
                        status: 'pending',
                        unixtime: '0',
                        harvestmc: 0,
                        harvestmg: 0,
                        harvestap: 0
                    },
        
                ]

                await Ingamegames.insertMany(games)
        
                // dailyactivities
                const dailyactivities = [
                    {
                        owner: userid,
                        type: "1",
                        status: 'not-claimed'
                    },
                    {
                        owner: userid,
                        type: "2",
                        status: 'not-claimed'
                    },
                    {
                        owner: userid,
                        type: "3",
                        status: 'not-claimed'
                    },
                    {
                        owner: userid,
                        type: "4",
                        status: 'not-claimed'
                    },
                    {
                        owner: userid,
                        type: "5",
                        status: 'not-claimed'
                    },
        
                ]

                await Dailyactivities.insertMany(dailyactivities)

                // energy
                const energy = {
                        owner: userid,
                        amount: 0
                }
                    
                await Energy.insertOne(energy)
        
                //playtimegrinding
        
                const playtimegrinding = [
                    {
                        owner: userid,
                        type: "woodcutting",
                        day: 0, 
                        hours: 0, 
                        minute: 0, 
                        seconds: 0,
                    },
                    {
                        owner: userid,
                        type: "mining",
                        day: 0, 
                        hours: 0, 
                        minute: 0, 
                        seconds: 0,
                    },
                    {
                        owner: userid,
                        type: "fishing",
                        day: 0, 
                        hours: 0, 
                        minute: 0, 
                        seconds: 0,
                    },
                    {
                        owner: userid,
                        type: "farming",
                        day: 0, 
                        hours: 0, 
                        minute: 0, 
                        seconds: 0,
                    },
                    {
                        owner: userid,
                        type: "hunting",
                        day: 0, 
                        hours: 0, 
                        minute: 0, 
                        seconds: 0,
                    },
                    {
                        owner: userid,
                        type: "crafting",
                        day: 0, 
                        hours: 0, 
                        minute: 0, 
                        seconds: 0,
                    },
                    {
                        owner: userid,
                        type: "smithing",
                        day: 0, 
                        hours: 0, 
                        minute: 0, 
                        seconds: 0,
                    },
        
        
                ]

                await Playtimegrinding.insertMany(playtimegrinding)
        
                const leaderboard = {
                    owner: userid,
                    amount: 0,
                }
        
                await Ingameleaderboard.insertOne(leaderboard)

                parentPort.postMessage({message: "success", data: "Account Migrated Successfully"})
                await db.close
                return
            })
            .catch(async err => {
                console.error(err)
                if(userid == ''){
                parentPort.postMessage({message: 'failed'})
                await db.close
                return
                }

                await Cashouthistory.deleteMany({owner: userid})
                await Wallethistory.deleteMany({owner: userid})
                await Playerdetails.deleteMany({owner: userid})
                await Gamewallet.deleteMany({owner: userid})
                await Walletscutoff.deleteMany({owner: userid})
                await Equipment.deleteMany({owner: userid})
                await Clock.deleteMany({owner: userid})
                await Ingamegames.deleteMany({owner: userid})
                await Dailyactivities.deleteMany({owner: userid})
                await Energy.deleteMany({owner: userid})
                await Playtimegrinding.deleteMany({owner: userid})
                await Ingameleaderboard.deleteMany({owner: userid})
                await Gameusers.deleteOne({_id: userid})

                parentPort.postMessage({message: 'failed'})
                await db.close
                return

            })

        
        } else if (error1){
            return parentPort.postMessage({message: "failed", data: error1})
        }
    })
})