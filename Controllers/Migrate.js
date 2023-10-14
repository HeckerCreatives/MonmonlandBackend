// const Migrate = require('../Models/Migrate')
const Gameactivity = require('../Models/Gameactivity')
const Subscription = require('../Models/Subscription')
const Roles = require('../Models/Roles')
const Roadmap = require("../Models/Roadmap")
const TopUpWallet = require("../Models/Topupwallet")
const PayoutWallet = require("../Models/PayoutWallet")
const User = require("../Models/Users")
const AdminFeeWallet = require("../Models/Adminfeewallet")
const Monmoncoin = require("../Models/Monmoncoin")
const Totalusers = require("../Models/Totalusers")
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
        // {
        //     _id:"629a98a5a881575c013b5324",
        //     subscriptionName: "Free",
        //     amount: "FREE"
        // },
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
            _id:"629a98a5a881575c013b5337",
            display_name: "SubAdministrator"
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

    const roadmap = [
        {
            _id:"629a98a5a881575c013b5333",
            title: "Slot1",
            image: "Empty",
            description:"Empty"
        },
        {
            _id:"629a98a5a881575c013b5334",
            title: "Slot2",
            image: "Empty",
            description:"Empty"
        },
        {
            _id:"629a98a5a881575c013b5335",
            title: "Slot3",
            image: "Empty",
            description:"Empty"
        },
        {
            _id:"629a98a5a881575c013b5336",
            title: "Slot4",
            image: "Empty",
            description:"Empty"
        },
    ];
    Roadmap.create(roadmap)

    const topup = [
        {
            _id: "629a98a5a881575c013b5337",
            amount: 0,
            name: "request"
        },
        {
            _id: "629a98a5a881575c013b5338",
            amount: 0,
            name: "process"
        },
        {
            _id: "629a98a5a881575c013b5339",
            amount: 0,
            name: "done"
        },

    ]

    TopUpWallet.create(topup)

    const topuppayout = [
        {
            _id: "629a98a5a881575c013b5339",
            amount: 0,
            name: "request",
            user: "64672f8f6d8526e7eed1759b"
        },
        {
            _id: "629a98a5a881575c013b5340",
            amount: 0,
            name: "process",
            user: "64672f8f6d8526e7eed1759b"
        },
        {
            _id: "629a98a5a881575c013b5341",
            amount: 0,
            name: "done",
            user: "64672f8f6d8526e7eed1759b"
        },

    ]

    PayoutWallet.create(topuppayout)

    const admin = {
        "_id": "64672f8f6d8526e7eed1759b",
        "roleId": "629a98a5a881575c013b5329",
        "userName": "superadmin",
        "email": "superadmin@gmail.com",
        "firstName": "superadmin",
        "lastName": "superadmin",
        "password": "dev123",
        "isVerified": true,
        "isActive": true,
        "banned": false,
        "balance": 0,
        "phone": "123456789"
    }


    User.create(admin)

    const adminfee = {
        _id:"629a98a5a881575c013b5360",
        amount: 0,
        user: "64672f8f6d8526e7eed1759b"
      }

      AdminFeeWallet.create(adminfee)
    
      const data = [ 
        {
            _id: "629a98a5a881575c013b5370",
            name: "Monster Coin",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5371",
            name: "Monster Gem",
            amount: 0
        }
    ]

    Monmoncoin.create(data)

    const totaluser = {
        _id: "629a98a5a881575c013b5373",
        count: 0
    }

    Totalusers.create(totaluser)

    response.json('Data migration created')

}

exports.topupwallet = (req, response) => {
    const topup = [
        {
            _id: "629a98a5a881575c013b5337",
            amount: 0,
            name: "manual"
        },
        {
            _id: "629a98a5a881575c013b5338",
            amount: 0,
            name: "automatic"
        },

    ]

    TopUpWallet.create(topup)

    response.json("topupwallet created.")
}

exports.payoutwallet = (req, response) => {
    const topup = [
        {
            _id: "629a98a5a881575c013b5339",
            amount: 0,
            name: "request",
            user: "64672f8f6d8526e7eed1759b"
        },
        {
            _id: "629a98a5a881575c013b5340",
            amount: 0,
            name: "process",
            user: "64672f8f6d8526e7eed1759b"
        },
        {
            _id: "629a98a5a881575c013b5341",
            amount: 0,
            name: "done",
            user: "64672f8f6d8526e7eed1759b"
        },

    ]

    PayoutWallet.create(topup)

    

    response.json("payoutwallet created.")
}

exports.adminfeewallet = (req, res) => {

    const adminfee = {
        _id:"629a98a5a881575c013b5360",
        amount: 0,
        user: "64672f8f6d8526e7eed1759b"
      }

      AdminFeeWallet.create(adminfee)

      res.json("adminfeewallet created")
}

exports.monmoncoin = (req, res) => {
    const data = [ 
        {
            _id: "629a98a5a881575c013b5370",
            name: "Monster Coin",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5371",
            name: "Monster Gem",
            amount: 0
        }
    ]

    Monmoncoin.create(data)
    res.json("Monmon coin mc and mg created")
}

exports.totalusers = (req, res) => {
    
    const totaluser = {
        _id: "629a98a5a881575c013b5373",
        count: 0
    }

    Totalusers.create(totaluser)
    res.json("total users created")
}