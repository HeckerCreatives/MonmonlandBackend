const { parentPort } = require('worker_threads')

const moment = require('moment');
const bcrypt = require('bcrypt')
var playfab = require('playfab-sdk')
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
PlayFab.settings.titleId = process.env.monmontitleid;
const { connectToDatabase } = require('./db');
const { default: mongoose } = require('mongoose');

const encrypt = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

parentPort.on('message', async (message) => {
    const username = message[0]
    const password =  message[1]
    const playfabToken = message[2]
    const thetime = message[3]
    const referral = message[4]
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
    const createdat = new Date(createdat)
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
            const Cosmetics = db.collection('cosmetics')
            const Dailylimit = db.collection('dailylimits')
            
            const personaldetails = JSON.parse(result1.data.FunctionResult.data.personalDetails.Value)
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


            let userid
            let pass = await encrypt(password)
            await Gameusers.insertOne({
                username: username,
                password: pass,
                status: "active",
                referral: new mongoose.Types.ObjectId(referral),
                createdAt: createdat
            })
            .then(async data => {
                userid = data.insertedId

                // pooldetails
                const pooldetails = {
                    owner: userid,
                    status: poolDetails.status,
                    rank: "none",
                    subscription: poolDetails.subscription,
                    createdAt: createdat
                }

                await Pooldetails.insertOne(pooldetails)

                // gamewallet

                const gamewallet = [
                    {
                        owner: userid,
                        wallettype: "activitypoints",
                        amount: 0,
                        createdAt: createdat
                    },  
                    {
                        owner: userid,
                        wallettype: "adspoints",
                        amount: 0,
                        createdAt: createdat

                    },
                    {
                        owner: userid,
                        wallettype: "purchasepoints",
                        amount: 0,
                        createdAt: createdat

                    },
                    {
                        owner: userid,
                        wallettype: "taskpoints",
                        amount: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        wallettype: "directpoints", // group point na ituh
                        amount: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        wallettype: "grouppoints",
                        amount: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        wallettype: "totalpoints",
                        amount: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        wallettype: "monstergemfarm",
                        amount: wallets.monsterGem,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        wallettype: "monstergemunilevel",
                        amount: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        wallettype: "monstercoin",
                        amount: wallets.monsterCoin,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        wallettype: "balance",
                        amount: wallets.balance,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        wallettype: "totalincome",
                        amount: wallets.totalIncome,
                        createdAt: createdat
                    },
        
                ]

                await Gamewallet.insertMany(gamewallet)

                        // walletcuoff
        
                const walletcutoff = [
                    {
                        owner: userid,
                        wallettype: "activitypoints",
                        amount: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        wallettype: "adspoints",
                        amount: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        wallettype: "purchasepoints",
                        amount: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        wallettype: "taskpoints",
                        amount: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        wallettype: "directpoints",
                        amount: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        wallettype: "totalpoints",
                        amount: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        wallettype: "grouppoints",
                        amount: 0,
                        createdAt: createdat
                    },
        
                ]
        
                await Walletscutoff.insertMany(walletcutoff)

                        // equipment

                const equipment = [
                    {
                        owner: userid,
                        type: "1",
                        isowned: "1",
                        expiration: 0,
                        isequip: '1',
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "2",
                        isowned: "0",
                        expiration: 0,
                        isequip: '0',
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "3",
                        isowned: "0",
                        expiration: 0,
                        isequip: '0',
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "4",
                        isowned: "0",
                        expiration: 0,
                        isequip: '0',
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "5",
                        isowned: "0",
                        expiration: 0,
                        isequip: '0',
                        createdAt: createdat
                    },
        
                ]

                await Equipment.insertMany(equipment)
        
                // clock
        
                const clock = [
                    {
                        owner: userid,
                        type: "1",
                        isowned: "0",
                        expiration: 0,
                        isequip: '0',
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "2",
                        isowned: "0",
                        expiration: 0,
                        isequip: '0',
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "3",
                        isowned: "0",
                        expiration: 0,
                        isequip: '0',
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "4",
                        isowned: "0",
                        expiration: 0,
                        isequip: '0',
                        createdAt: createdat
                    },
        
                ]

                await Clock.insertMany(clock)

                        // games
                const games = [
                    {
                        owner: userid,
                        type: "woodcutting",
                        status: 'pending',
                        unixtime: 0,
                        harvestmc: 0,
                        harvestmg: 0,
                        harvestap: 0,
                        timestarted: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "mining",
                        status: 'pending',
                        unixtime: 0,
                        harvestmc: 0,
                        harvestmg: 0,
                        harvestap: 0,
                        timestarted: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "fishing",
                        status: 'pending',
                        unixtime: 0,
                        harvestmc: 0,
                        harvestmg: 0,
                        harvestap: 0,
                        timestarted: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "farming",
                        status: 'pending',
                        unixtime: 0,
                        harvestmc: 0,
                        harvestmg: 0,
                        harvestap: 0,
                        timestarted: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "hunting",
                        status: 'pending',
                        unixtime: 0,
                        harvestmc: 0,
                        harvestmg: 0,
                        harvestap: 0,
                        timestarted: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "crafting",
                        status: 'pending',
                        unixtime: 0,
                        harvestmc: 0,
                        harvestmg: 0,
                        harvestap: 0
                    },
                    {
                        owner: userid,
                        type: "smithing",
                        status: 'pending',
                        unixtime: 0,
                        harvestmc: 0,
                        harvestmg: 0,
                        harvestap: 0,
                        timestarted: 0,
                        createdAt: createdat
                    },
        
                ]

                await Ingamegames.insertMany(games)

                // energy
                const energy = {
                        owner: userid,
                        amount: 0,
                        createdAt: createdat
                }
                    
                await Energy.insertOne(energy)

                // dailyactivities
                const dailyactivities = [
                    {
                        owner: userid,
                        type: "1",
                        status: 'not-claimed',
                        taskpoints: 1,
                        rewardsmc: 1,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "2",
                        status: 'not-claimed',
                        taskpoints: 3,
                        rewardsmc: 1,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "3",
                        status: 'not-claimed',
                        taskpoints: 5,
                        rewardsmc: 2,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "4",
                        status: 'not-claimed',
                        taskpoints: 10,
                        rewardsmc: 3,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "5",
                        status: 'not-claimed',
                        taskpoints: 10,
                        rewardsmc: 3,
                        createdAt: createdat
                    },
        
                ]

                await Dailyactivities.insertMany(dailyactivities)

                //playtimegrinding
                
                const playtimegrinding = [
                    {
                        owner: userid,
                        type: "woodcutting",
                        currenttime: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "mining",
                        currenttime: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "fishing",
                        currenttime: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "farming",
                        currenttime: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "hunting",
                        currenttime: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "crafting",
                        currenttime: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        type: "smithing",
                        currenttime: 0,
                        createdAt: createdat
                    },


                ]

                await Playtimegrinding.insertMany(playtimegrinding)

                //leaderboard
                const leaderboard = {
                    owner: userid,
                    amount: 0,
                    createdAt: createdat
                }
        
                await Ingameleaderboard.insertOne(leaderboard)

                //cosmetics
                if(cosmetics !== null){
                    const data = {
                        owner: userid,
                        name: poolDetails.subscription,
                        type: "ring",
                        permanent: "permanent",
                        expiration: 0,
                        isequip: "0",
                        createdAt: createdat
                    }

                    Cosmetics.insertOne(data)
                }

                const dailylimit = [
                    {
                        owner: userid,
                        wallettype: 'monstercoin',
                        amount: 0,
                        createdAt: createdat
                    },
                    {
                        owner: userid,
                        wallettype: 'monstergemfarm',
                        amount: 0,
                        createdAt: createdat
                    },
                ]

                Dailylimit.insertMany(dailylimit)

                

                // playerdetails
                const playerdetails = {
                    owner: userid,
                    phone: personaldetails.phone,
                    email: personaldetails.email,
                    createdAt: createdat
                }
        
                await Playerdetails.insertOne(playerdetails)


        
        
        
        
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
                await Dailylimit.deleteMany({owner: userid})
                parentPort.postMessage({message: 'failed'})
                await db.close
                return

            })

        
        }
         else if (error1){
            return parentPort.postMessage({message: "failed", data: error1})
        }
    })
})