// const Migrate = require('../Models/Migrate')
const Gameactivity = require('../Models/Gameactivity')
const Subscription = require('../Models/Subscription')
const Roles = require('../Models/Roles')

module.exports.migratedata = (request, response) => {
    const subscription = [
        {
            _id:"629a98a5a881575c013b5325",
            subscriptionName: "Pearl",
            amount: "FREE"
        },
        {
            _id:"629a98a5a881575c013b5326",
            subscriptionName: "Ruby",
            amount: "FREE"
        },
        {
            _id:"629a98a5a881575c013b5327",
            subscriptionName: "Emerald",
            amount: "FREE"
        },
        {
            _id:"629a98a5a881575c013b5328",
            subscriptionName: "Diamond",
            amount: "FREE"
        },
    ];
    subscription.map(subs => {
        Subscription.create(subs)
    })

    const roles = [
        {
            _id:"629a98a5a881575c013b5329",
            display_name: "Administrator"
        },
        {
            _id:"629a98a5a881575c013b5330",
            display_name: "Agent"
        },
        {
            _id:"629a98a5a881575c013b5331",
            display_name: "Player"
        },
    ];
    roles.map(role =>{
        Roles.create(role)
    })

    const progressbar = [
        {
            _id:"629a98a5a881575c013b5332",
            total: 0,
            initial: 0
        },
    ];
    Gameactivity.create(progressbar)

    response.json('Data migration created')

}