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
const Wallets = require("../Models/Wallets")
const SubsAccumulated = require("../Models/SubsAccumulated")
const Merchandise = require("../Models/Merchandise")
const withdrawal = require("../Models/Withdrawalfee")
const Ads = require("../Models/Ads")
const Leaderboard = require("../Models/Leaderboard")
const Communityactivity = require("../Models/Communityactivity")
const Communityactivityaccumulated = require("../Models/Communityactivyaccumulated")
const Investorfunds = require("../Models/Investorfunds")
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
            name: "manual",
            user: "64672f8f6d8526e7eed1759b"
        },
        {
            _id: "629a98a5a881575c013b5338",
            amount: 0,
            name: "automatic",
            user: "64672f8f6d8526e7eed1759b"
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
        {
            _id: "629a98a5a881575c013b5342",
            amount: 0,
            name: "reject",
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
        "phone": "123456789",
        "playfabid": "79FDE99C184D93EB"
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

    const commiwallet = {
        _id: "629a98a5a881575c013b5380",
        userId: "64672f8f6d8526e7eed1759b",
        commission: 0
    }

    Wallets.create(commiwallet)

    const subsaccudata = [
        {  
            _id: "629a98a5a881575c013b5350",
            subsname: "pearl",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5351",
            subsname: "ruby",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5352",
            subsname: "emerald",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5353",
            subsname: "diamond",
            amount: 0
        },
    ]

    SubsAccumulated.create(subsaccudata )

    const merchandisedata = [
        {
            _id: "629a98a5a881575c013b5354",
            item: "tools",
            amount: 0,
        },
        {
            _id: "629a98a5a881575c013b5355",
            item: "clock",
            amount: 0,
        },
    ]

    Merchandise.create(merchandisedata)

    const withdrawfee =  {
        _id: "629a98a5a881575c013b5358",
        userId: "64672f8f6d8526e7eed1759b",
        withdrawalfee: 0,
        
    }
       
    withdrawal.create(withdrawfee)

    const ads = {
        _id: "629a98a5a881575c013b5368",
        amount: 0
    }

    Ads.create(ads)

    const leaderboard = {
        _id: "629a98a5a881575c013b5369",
        amount: 0
    }

    Leaderboard.create(leaderboard)

    const communityactivity = [
        {
            _id: "629a98a5a881575c013b5461",
            type: "leaderboard",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5462",
            type: "grinding",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5463",
            type: "quest",
            amount: 0
        },

    ]

    Communityactivity.create(communityactivity)

    const communityactivityaccumulated = {
        _id: "629a98a5a881575c013b5561",
        leaderboardamount: 0,
        grindingamount: 0 ,
        questamount: 0 ,
    }

    Communityactivityaccumulated.create(communityactivityaccumulated)

    const investorfunds = {
        _id: "629a98a5a881575c013b5600",
        amount: 0
    }

    Investorfunds.create(investorfunds)
    
    response.json('Data migration created')

}

exports.investorfund = (req, res) => {
    const investorfunds = {
        _id: "629a98a5a881575c013b5600",
        amount: 0
    }

    Investorfunds.create(investorfunds)

    res.json("investorfund wallet created")
}

exports.topupwallet = (req, response) => {
    const topup = [
        {
            _id: "629a98a5a881575c013b5337",
            amount: 0,
            name: "manual",
            user: "64672f8f6d8526e7eed1759b"
        },
        {
            _id: "629a98a5a881575c013b5338",
            amount: 0,
            name: "automatic",
            user: "64672f8f6d8526e7eed1759b"
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
        {
            _id: "629a98a5a881575c013b5342",
            amount: 0,
            name: "reject",
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

exports.admincommi = (req, res) => {
    const commiwallet = {
        _id: "629a98a5a881575c013b5380",
        userId: "64672f8f6d8526e7eed1759b",
        commission: 0
    }

    Wallets.create(commiwallet)

    res.json("admin commi wallet created")
}

exports.subs = (req, res) => {
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

    res.json("subs created")
}

exports.withdrawfee = (req, res) => {
    const withdrawfee =  {
        _id: "629a98a5a881575c013b5358",
        userId: "64672f8f6d8526e7eed1759b",
        withdrawalfee: 0,
        
    }
       
    withdrawal.create(withdrawfee)
    res.json("withdrawl fee wallet created")
}

exports.adsandleaderboard = (req, res) => {
    const ads = {
        _id: "629a98a5a881575c013b5368",
        amount: 0
    }

    Ads.create(ads)

    const leaderboard = {
        _id: "629a98a5a881575c013b5369",
        amount: 0
    }

    Leaderboard.create(leaderboard)

    res.json("ads and leaderboard created")
}

exports.communityactivity = (req, res) => {
    const communityactivity = [
        {
            _id: "629a98a5a881575c013b5461",
            type: "leaderboard",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5462",
            type: "grinding",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5463",
            type: "quest",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5464",
            type: "diamondpools",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5465",
            type: "devsshare",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5466",
            type: "companyshare",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5467",
            type: "officers",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5468",
            type: "marketing",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5469",
            type: "incentives",
            amount: 0
        },
        {
            _id: "629a98a5a881575c013b5470",
            type: "monstergem",
            amount: 0
        },
    ]

    Communityactivity.create(communityactivity)

    res.json("communityactivity created")
}

exports.communityactivityaccumulated = (req, res) => {

    const communityactivityaccumulated = {
        _id: "629a98a5a881575c013b5561",
        leaderboardamount: 0,
        grindingamount: 0 ,
        questamount: 0 ,
    }

    Communityactivityaccumulated.create(communityactivityaccumulated)

    res.json("communityactivity accumulated created")
}