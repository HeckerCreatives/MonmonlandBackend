const Maintenance = require("../Gamemodels/Maintenance")
const { MongoClient } = require('mongodb');
const Monmoncoin = require("../Models/Monmoncoin")
const Ads = require("../Models/Ads")
const Communityactivity = require("../Models/Communityactivity")
const Investorfunds = require("../Models/Investorfunds")
const Gameactivity = require("../Models/Gameactivity")
require("dotenv").config();

exports.checkmaintenance = async (maintenancetype) => {
    return await Maintenance.findOne({type: maintenancetype})
    .then(data => {
        if (!data){
            return "nomaintenance"
        }

        return data.value
    })
    .catch(() => "bad-request")
}

// use if not owned yet
exports.DateTimeServerExpiration1 = (expiration) => {
    const date = new Date();

    // Get the Unix timestamp in milliseconds
    const unixTimeMilliseconds = date.getTime();

    // Convert it to Unix timestamp in seconds
    const unixTimeSeconds = Math.floor(unixTimeMilliseconds / 1000);

    // Add 30 days (30 * 24 * 60 * 60 seconds) to the current timestamp
    const unixTimeSecondsIn30Days = unixTimeSeconds + (expiration * 24 * 60 * 60);

    return unixTimeSecondsIn30Days;
}

// use if already owned
exports.DateTimeServerExpiration2 = (expiration) => {
    // const date = new Date();

    // // Get the Unix timestamp in milliseconds
    // const unixTimeMilliseconds = date.getTime();

    // // Convert it to Unix timestamp in seconds
    // const unixTimeSeconds = Math.floor(unixTimeMilliseconds / 1000);

    // Add 30 days (30 * 24 * 60 * 60 seconds) to the current timestamp
    const unixTimeSecondsIn30Days = (expiration * 24 * 60 * 60);

    return unixTimeSecondsIn30Days;
}

exports.getmaxenergy = (subslevel) => {
    let finalmaxenergy = 0

    switch(subslevel){
        case "Pearl":
            finalmaxenergy = 20
        case "Ruby":
            finalmaxenergy = 40
            break;
        case "Emerald":
            finalmaxenergy = 80
            break;
        case "Diamond":
            finalmaxenergy = 150
            break;
        default:
            finalmaxenergy = 0
            break;
    }

    return finalmaxenergy
}

let client;

exports.connecttodatabase = async() => {
    client = new MongoClient(process.env.MONGOOSE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();
    console.log("connected to MongoDB");

    return client;
}

exports.closedatabase = async() => {
    await client.close();
    console.log("disconnected to MongoDB");
}

exports.checkmclimit = async (amount) => {

    const additional = await Gameactivity.findOne()
    .then(data => {
        return data.total
    })

    const ads = await Ads.findOne()
    .then(data => {
        return data.amount
    })

    const grinding = await Communityactivity.findOne({type: "grinding"})
    .then(data => {
        return data.amount
    })

    const quest = await Communityactivity.findOne({type: "quest"})
    .then(data => {
        return data.amount
    })

    const investorfundca = await Communityactivity.findOne({type: "investorfunds"})
    .then(data => {
        return data.amount
    })

    const investor = await Investorfunds.findOne()
    .then(data => {
        return data.amount
    })

    const totalfarm = ( ads + grinding + quest + investor + additional + investorfundca) * 1000

    const mc = await Monmoncoin.findOne({name: "Monster Coin"})
    .then((data) => {
        return data.amount
    })

   const finaladd = mc + amount

    if(finaladd < totalfarm ){
       return false
    } else {
       return true
    }
    
}

exports.checkmglimit = async (amount) => {

    const additionalmg = await Gameactivity.findOne() // header value
    .then(data => {
        return data.initial
    })

    const mgca = await Communityactivity.findOne({type: "monstergem"}) // header value 
    .then(data => {
        return data.amount
    })

    const mg = await Monmoncoin.findOne({name: "Monster Gem"}) // total accumulated total farmed
    .then((data)=> {
        return data.amount
    })

    const total = (additionalmg + mgca) 

    const finaladd = mg + amount
    
    if(finaladd < total){
        return false
    } else {
        return true   
    }

    
}