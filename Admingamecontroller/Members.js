const Gameusers = require('../Gamemodels/Gameusers')
const Playerdetails = require('../Gamemodels/Playerdetails')
const Wallets = require('../Gamemodels/Wallets')
const Communityactivity = require("../Models/Communityactivity")
const Monmoncoin = require("../Models/Monmoncoin")
const Gameactivity = require("../Models/Gameactivity")
const Ads = require("../Models/Ads")
const Investorfunds = require("../Models/Investorfunds")
const Wallethistory = require('../Gamemodels/Wallethistory')
const Pooldetails = require('../Gamemodels/Pooldetails')
const moment = require('moment-timezone');
const Ingameleaderboard = require("../Gamemodels/Leaderboard")
const Fiesta = require("../Gamemodels/Fiesta")
const Sponsor = require("../Gamemodels/Sponsor")
const mongoose = require("mongoose");
const Equipment = require("../Gamemodels/Equipment")
const Clock = require('../Gamemodels/Clock')
const Cosmetics = require("../Gamemodels/Cosmetics")
const WalletsCutoff = require('../Gamemodels/Walletscutoff')
const Paymentdetails = require("../Gamemodels/Paymentdetails")
const DragonPaymentdetails = require('../Models/Paymentdetails')
const Energyinventories = require('../Gamemodels/Energyinventories')
const Gameannouncement = require("../Gamemodels/Gameannouncement")
const Maintenance = require("../Gamemodels/Maintenance")
const Walletscutoff = require("../Gamemodels/Walletscutoff")
const Prizepools = require("../Gamemodels/Prizepools")
const Sponsorlist = require("../Gamemodels/Sponsorlist")
const Analytics = require("../Gamemodels/Analytics") // Transaction history
const GrindingHistory = require("../Gamemodels/Grindinghistory")
const Payablehistory = require("../Models/Payableshistory")
const { DateTimeServerExpiration1, DateTimeServerExpiration2, checkmclimit, checkmglimit } = require("../Utils/utils")
const { checktokenlimit, checkairdroplimit } = require("../Utils/Walletutils")
const bcrypt = require('bcrypt')
const Token = require('../Gamemodels/Token')
const Tokentransaction = require("../Gamemodels/Tokentransaction")
const Buytokenhistory = require('../Gamemodels/Buytokenhistory')
const { nanoid } = require("nanoid")
const Airdroptransaction = require('../Gamemodels/Airdroptransaction')
const encrypt = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// exports.find = (req, res) => {
//     const pageOptions = {
//         page: parseInt(req.query.page) || 0,
//         limit: parseInt(req.query.limit) || 10
//     }

//     Gameusers.aggregate([
//         {
//             $lookup: {
//                 from: "playerdetails",
//                 let: { userId: "$_id" },
//                 pipeline: [
//                     {
//                         $match: {
//                             $expr: { $eq: ["$owner", "$$userId"] }
//                         }
//                     },
//                     {
//                         $project: {
//                             _id: 0,
//                             owner: 0,
//                             createdAt: 0,
//                             updatedAt: 0,
//                             __v: 0
//                             // Add other fields to exclude as needed
//                         }
//                     }
//                 ],
//                 as: "playerDetails"
//             }
//         },
//         {
//             $unwind: "$playerDetails" // Unwind the playerDetails array
//         },
//         {
//             $lookup: {
//                 from: "gameusers",
//                 localField: "referral",
//                 foreignField: "_id",
//                 as: "referralUser"
//             }
//         },
//         {
//             $lookup: {
//                 from: "pooldetails",
//                 localField: "_id",
//                 foreignField: "owner",
//                 as: "userSubscription"
//             }
//         },
//         {
//             $unwind: "$userSubscription" // Unwind the userSubscription array
//         },
//         {
//             $lookup: {
//                 from: "gamewallets",
//                 localField: "_id",
//                 foreignField: "owner",
//                 pipeline: [
//                     {
//                         $project: {
//                             _id: 0,
//                             owner: 0,
//                             createdAt: 0,
//                             updatedAt: 0,
//                             __v: 0
//                             // Add other fields to exclude as needed
//                         }
//                     }
//                 ],
//                 as: "userWallet"
//             }
//         },
//         {
//             $project: {
//                 _id: 0,
//                 username: 1,
//                 status: 1,
//                 referral: { $arrayElemAt: ["$referralUser.username", 0] },
//                 createdAt: 1,
//                 phone: "$playerDetails.phone",
//                 email: "$playerDetails.email",
//                 subscription: "$userSubscription.subscription",
//                 monstercoin: {
//                     $arrayElemAt: [
//                       {
//                         $map: {
//                           input: {
//                             $filter: {
//                               input: "$userWallet",
//                               as: "wallet",
//                               cond: { $eq: ["$$wallet.wallettype", "monstercoin"] }
//                             }
//                           },
//                           as: "wallet",
//                           in: "$$wallet.amount"
//                         }
//                       },
//                       0
//                     ]
//                 },
//                 monstergem: {
//                     $arrayElemAt: [
//                       {
//                         $map: {
//                           input: {
//                             $filter: {
//                               input: "$userWallet",
//                               as: "wallet",
//                               cond: { $eq: ["$$wallet.wallettype", "monstergemfarm"] }
//                             }
//                           },
//                           as: "wallet",
//                           in: "$$wallet.amount"
//                         }
//                       },
//                       0
//                     ]
//                 },
//                 monstergemunilevel: {
//                     $arrayElemAt: [
//                       {
//                         $map: {
//                           input: {
//                             $filter: {
//                               input: "$userWallet",
//                               as: "wallet",
//                               cond: { $eq: ["$$wallet.wallettype", "monstergemunilevel"] }
//                             }
//                           },
//                           as: "wallet",
//                           in: "$$wallet.amount"
//                         }
//                       },
//                       0
//                     ]
//                 },
//                 walletbalance: {
//                     $arrayElemAt: [
//                       {
//                         $map: {
//                           input: {
//                             $filter: {
//                               input: "$userWallet",
//                               as: "wallet",
//                               cond: { $eq: ["$$wallet.wallettype", "balance"] }
//                             }
//                           },
//                           as: "wallet",
//                           in: "$$wallet.amount"
//                         }
//                       },
//                       0
//                     ]
//                 },
//                 totalincome: {
//                     $arrayElemAt: [
//                       {
//                         $map: {
//                           input: {
//                             $filter: {
//                               input: "$userWallet",
//                               as: "wallet",
//                               cond: { $eq: ["$$wallet.wallettype", "totalincome"] }
//                             }
//                           },
//                           as: "wallet",
//                           in: "$$wallet.amount"
//                         }
//                       },
//                       0
//                     ]
//                 },
//             }
//         },
//         {
//             $sort: {
//               createdAt: -1 // Sort in descending order based on createdAt field
//             }
//         },
//         {
//             $match: {
//                 status: "active",
//                 username: { $ne: "monmonland" }
//             }
//         },
//         { 
//             $skip: pageOptions.page * pageOptions.limit 
//         },
//         { 
//             $limit: pageOptions.limit 
//         },
//     ])
//     .then(data => {
//         res.json({message: "success", data: data})
//     })
//     .catch(err => {
//         res.json({message: "failed", data: err})
//     })
// }
exports.find = async (req, res) => {
    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    };

    // Calculate total count before pagination
    const totalCountPromise = await Gameusers.countDocuments({
        status: { $in: ["active", "expired"] },
        username: { $ne: "monmonland" }
    });

    // Perform the aggregation with pagination
    const aggregationPromise = await Gameusers.aggregate([
        {
            $lookup: {
                from: "playerdetails",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$owner", "$$userId"] }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            owner: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                            // Add other fields to exclude as needed
                        }
                    }
                ],
                as: "playerDetails"
            }
        },
        {
            $unwind: "$playerDetails" // Unwind the playerDetails array
        },
        {
            $lookup: {
                from: "gameusers",
                localField: "referral",
                foreignField: "_id",
                as: "referralUser"
            }
        },
        {
            $lookup: {
                from: "pooldetails",
                localField: "_id",
                foreignField: "owner",
                as: "userSubscription"
            }
        },
        {
            $unwind: "$userSubscription" // Unwind the userSubscription array
        },
        {
            $lookup: {
                from: "gamewallets",
                localField: "_id",
                foreignField: "owner",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            owner: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                            // Add other fields to exclude as needed
                        }
                    }
                ],
                as: "userWallet"
            }
        },
        {
            $project: {
                _id: 0,
                username: 1,
                status: 1,
                playstatus: 1,
                referral: { $arrayElemAt: ["$referralUser.username", 0] },
                createdAt: 1,
                phone: "$playerDetails.phone",
                email: "$playerDetails.email",
                subscription: "$userSubscription.subscription",
                monstercoin: {
                    $arrayElemAt: [
                        {
                        $map: {
                            input: {
                            $filter: {
                                input: "$userWallet",
                                as: "wallet",
                                cond: { $eq: ["$$wallet.wallettype", "monstercoin"] }
                            }
                            },
                            as: "wallet",
                            in: "$$wallet.amount"
                        }
                        },
                        0
                    ]
                },
                monstergem: {
                    $arrayElemAt: [
                        {
                        $map: {
                            input: {
                            $filter: {
                                input: "$userWallet",
                                as: "wallet",
                                cond: { $eq: ["$$wallet.wallettype", "monstergemfarm"] }
                            }
                            },
                            as: "wallet",
                            in: "$$wallet.amount"
                        }
                        },
                        0
                    ]
                },
                monstergemunilevel: {
                    $arrayElemAt: [
                        {
                        $map: {
                            input: {
                            $filter: {
                                input: "$userWallet",
                                as: "wallet",
                                cond: { $eq: ["$$wallet.wallettype", "monstergemunilevel"] }
                            }
                            },
                            as: "wallet",
                            in: "$$wallet.amount"
                        }
                        },
                        0
                    ]
                },
                walletbalance: {
                    $arrayElemAt: [
                        {
                        $map: {
                            input: {
                            $filter: {
                                input: "$userWallet",
                                as: "wallet",
                                cond: { $eq: ["$$wallet.wallettype", "balance"] }
                            }
                            },
                            as: "wallet",
                            in: "$$wallet.amount"
                        }
                        },
                        0
                    ]
                },
                totalincome: {
                    $arrayElemAt: [
                        {
                        $map: {
                            input: {
                            $filter: {
                                input: "$userWallet",
                                as: "wallet",
                                cond: { $eq: ["$$wallet.wallettype", "totalincome"] }
                            }
                            },
                            as: "wallet",
                            in: "$$wallet.amount"
                        }
                        },
                        0
                    ]
                },
            }
        },
        {
            $match: {
                status: { $in: ["active", "expired"] },
                username: { $ne: "monmonland" }
            }
        },
        {
            $sort: {
                createdAt: -1 // Sort in descending order based on createdAt field
            }
        },
        {
            $skip: pageOptions.page * pageOptions.limit
        },
        {
            $limit: pageOptions.limit
        }
    ]);

    // Execute both promises concurrently
    Promise.all([totalCountPromise, aggregationPromise])
    .then(([totalCount, data]) => {
        const totalPages = Math.ceil(totalCount / pageOptions.limit);
        res.json({ message: "success", data: data, pages: totalPages });
    })
    .catch(err => {
        res.json({ message: "failed", data: err });
    });
}


exports.searchByUsername = async (req, res) => {
    const { username } = req.body

    const usernameRegex = new RegExp(`^${username}`, 'i');

    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    };

    const totalCountPromise = await Gameusers.countDocuments({
        status: { $in: ["active", "expired"] },
        username: { $regex: usernameRegex, $ne: "monmonland" }
    });
    
    const aggregationPromise = await Gameusers.aggregate([
        {
            $lookup: {
                from: "playerdetails",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$owner", "$$userId"] }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            owner: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                            // Add other fields to exclude as needed
                        }
                    }
                ],
                as: "playerDetails"
            }
        },
        {
            $unwind: "$playerDetails" // Unwind the playerDetails array
        },
        {
            $lookup: {
                from: "gameusers",
                localField: "referral",
                foreignField: "_id",
                as: "referralUser"
            }
        },
        {
            $lookup: {
                from: "pooldetails",
                localField: "_id",
                foreignField: "owner",
                as: "userSubscription"
            }
        },
        {
            $unwind: "$userSubscription" // Unwind the userSubscription array
        },
        {
            $lookup: {
                from: "gamewallets",
                localField: "_id",
                foreignField: "owner",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            owner: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                            // Add other fields to exclude as needed
                        }
                    }
                ],
                as: "userWallet"
            }
        },
        {
            $project: {
                _id: 0,
                username: 1,
                status: 1,
                playstatus: 1,
                referral: { $arrayElemAt: ["$referralUser.username", 0] },
                createdAt: 1,
                phone: "$playerDetails.phone",
                email: "$playerDetails.email",
                subscription: "$userSubscription.subscription",
                monstercoin: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "monstercoin"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                monstergem: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "monstergemfarm"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                monstergemunilevel: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "monstergemunilevel"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                walletbalance: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "balance"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                totalincome: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "totalincome"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
            }
        },
        {
            $match: {
                status: { $in: ["active", "expired"] },
                username: { $regex: usernameRegex }
            }
        },
        {
            $sort: {
              createdAt: -1 // Sort in descending order based on createdAt field
            }
        },
        
        {
            $skip: pageOptions.page * pageOptions.limit
        },
        {
            $limit: pageOptions.limit
        }
    ])

    // Execute both promises concurrently
    Promise.all([totalCountPromise, aggregationPromise])
    .then(([totalCount, data]) => {
        const totalPages = Math.ceil(totalCount / pageOptions.limit);
        res.json({ message: "success", data: data, pages: totalPages });
    })
    .catch(err => {
        res.json({ message: "failed", data: err });
    });
}

exports.searchByEmail = async (req, res) => {
    const { email } = req.body;

    // Create a regular expression for case-insensitive prefix search
    const emailRegex = new RegExp(`^${email}`, 'i');

    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    };

    const totalCountPromise = await Playerdetails.countDocuments({
        email: { $regex: emailRegex, $ne: "monmonland@gmail.com"  }
    });  

    const aggregationPromise = await Gameusers.aggregate([
        {
            $lookup: {
                from: "playerdetails",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$owner", "$$userId"] }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            owner: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                            // Add other fields to exclude as needed
                        }
                    }
                ],
                as: "playerDetails"
            }
        },
        {
            $unwind: "$playerDetails" // Unwind the playerDetails array
        },
        {
            $lookup: {
                from: "gameusers",
                localField: "referral",
                foreignField: "_id",
                as: "referralUser"
            }
        },
        {
            $lookup: {
                from: "pooldetails",
                localField: "_id",
                foreignField: "owner",
                as: "userSubscription"
            }
        },
        {
            $unwind: "$userSubscription" // Unwind the userSubscription array
        },
        {
            $lookup: {
                from: "gamewallets",
                localField: "_id",
                foreignField: "owner",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            owner: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                            // Add other fields to exclude as needed
                        }
                    }
                ],
                as: "userWallet"
            }
        },
        {
            $project: {
                _id: 0,
                username: 1,
                status: 1,
                playstatus: 1,
                referral: { $arrayElemAt: ["$referralUser.username", 0] },
                createdAt: 1,
                phone: "$playerDetails.phone",
                email: "$playerDetails.email",
                subscription: "$userSubscription.subscription",
                monstercoin: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "monstercoin"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                monstergem: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "monstergemfarm"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                monstergemunilevel: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "monstergemunilevel"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                walletbalance: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "balance"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                totalincome: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "totalincome"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
            }
        },
        {
            $sort: {
              createdAt: -1 // Sort in descending order based on createdAt field
            }
        },
        {
            $match: {
                status: { $in: ["active", "expired"] },
                email:  { $regex: emailRegex }
            }
        },
        {
            $skip: pageOptions.page * pageOptions.limit
        },
        {
            $limit: pageOptions.limit
        }
    ])
    
    Promise.all([totalCountPromise, aggregationPromise])
    .then(([totalCount, data]) => {
        const totalPages = Math.ceil(totalCount / pageOptions.limit);
        res.json({ message: "success", data: data, pages: totalPages });
    })
    .catch(err => {
        res.json({ message: "failed", data: err });
    });
};

exports.searchBySubscription = async (req, res) => {
    const { subscription } = req.body;
    // Create a regular expression for case-insensitive prefix search
    const subscriptionRegex = new RegExp(`^${subscription}`, 'i');

    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    };

    const totalCountPromise = await Pooldetails.countDocuments({
        subscription: subscription
    });  

    const aggregationPromise = await Gameusers.aggregate([
        {
            $lookup: {
                from: "playerdetails",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$owner", "$$userId"] }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            owner: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                            // Add other fields to exclude as needed
                        }
                    }
                ],
                as: "playerDetails"
            }
        },
        {
            $unwind: "$playerDetails" // Unwind the playerDetails array
        },
        {
            $lookup: {
                from: "gameusers",
                localField: "referral",
                foreignField: "_id",
                as: "referralUser"
            }
        },
        {
            $lookup: {
                from: "pooldetails",
                localField: "_id",
                foreignField: "owner",
                as: "userSubscription"
            }
        },
        {
            $unwind: "$userSubscription" // Unwind the userSubscription array
        },
        {
            $lookup: {
                from: "gamewallets",
                localField: "_id",
                foreignField: "owner",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            owner: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                            // Add other fields to exclude as needed
                        }
                    }
                ],
                as: "userWallet"
            }
        },
        {
            $project: {
                _id: 0,
                username: 1,
                status: 1,
                playstatus: 1,
                referral: { $arrayElemAt: ["$referralUser.username", 0] },
                createdAt: 1,
                phone: "$playerDetails.phone",
                email: "$playerDetails.email",
                subscription: "$userSubscription.subscription",
                monstercoin: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "monstercoin"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                monstergem: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "monstergemfarm"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                monstergemunilevel: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "monstergemunilevel"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                walletbalance: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "balance"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                totalincome: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "totalincome"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
            }
        },
        {
            $sort: {
              createdAt: -1 // Sort in descending order based on createdAt field
            }
        },
        {
            $match: {
                status: { $in: ["active", "expired"] },
                subscription: subscription
            }
        }
    ])

    Promise.all([totalCountPromise, aggregationPromise])
    .then(([totalCount, data]) => {
        const totalPages = Math.ceil(totalCount / pageOptions.limit);
        res.json({ message: "success", data: data, pages: totalPages });
    })
    .catch(err => {
        res.json({ message: "failed", data: err });
    });
};

exports.searchByWallet = async (req, res) => {
    const { wallet } = req.body;
    
    let pangsort;

    switch(wallet){
        case "monstercoin":
            pangsort = "monstercoin"
        break;
        case "monstergemfarm":
            pangsort = "monstergem"
        break;
        case "monstergemunilevel":
            pangsort = "monstergemunilevel"
        break;
        case "balance":
            pangsort = "walletbalance"
        break;
        case "totalincome":
            pangsort = "totalincome"
        break;

        default:
        break
    }

    const dynamicSort = {};
    dynamicSort[pangsort] = -1;

    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    };


    await Gameusers.aggregate([
        {
            $lookup: {
                from: "playerdetails",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$owner", "$$userId"] }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            owner: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                            // Add other fields to exclude as needed
                        }
                    }
                ],
                as: "playerDetails"
            }
        },
        {
            $unwind: "$playerDetails" // Unwind the playerDetails array
        },
        {
            $lookup: {
                from: "gameusers",
                localField: "referral",
                foreignField: "_id",
                as: "referralUser"
            }
        },
        {
            $lookup: {
                from: "pooldetails",
                localField: "_id",
                foreignField: "owner",
                as: "userSubscription"
            }
        },
        {
            $unwind: "$userSubscription" // Unwind the userSubscription array
        },
        {
            $lookup: {
                from: "gamewallets",
                localField: "_id",
                foreignField: "owner",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            owner: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            __v: 0
                            // Add other fields to exclude as needed
                        }
                    }
                ],
                as: "userWallet"
            }
        },
        {
            $project: {
                _id: 0,
                username: 1,
                status: 1,
                playstatus: 1,
                referral: { $arrayElemAt: ["$referralUser.username", 0] },
                createdAt: 1,
                phone: "$playerDetails.phone",
                email: "$playerDetails.email",
                subscription: "$userSubscription.subscription",
                monstercoin: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "monstercoin"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                monstergem: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "monstergemfarm"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                monstergemunilevel: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "monstergemunilevel"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                walletbalance: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "balance"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
                totalincome: {
                    $arrayElemAt: [
                      {
                        $map: {
                          input: {
                            $filter: {
                              input: "$userWallet",
                              as: "wallet",
                              cond: { $eq: ["$$wallet.wallettype", "totalincome"] }
                            }
                          },
                          as: "wallet",
                          in: "$$wallet.amount"
                        }
                      },
                      0
                    ]
                },
            }
        },
        {
            $sort: dynamicSort,
        },
        {
            $match: {
                status: { $in: ["active", "expired"] },
            }
        },
        
    ])
    .then(data => {
        // Extract the total count from the result
        const totalCount = data.length > 0 ? data.length : 0;
        const totalPages = Math.ceil(totalCount / pageOptions.limit);
        res.json({ message: "success", data: data, pages: totalPages });
    })
    .catch(err => {
        res.json({ message: "failed", data: err });
    });
};

exports.findByUsername = (req, res) => {
    const {username} = req.body;

    Gameusers.findOne({username: username})
    .then(user => {
        Wallets.find({owner: user._id})
        .then(async data => {

            const playerdetails = await Playerdetails.findOne({owner: user._id})
            .then(data => {
                return data
            })

            const pooldetail = await Pooldetails.findOne({owner: user._id})
            .select('status rank subscription')
            .then(pool => {
                return pool
            })
            .catch(error => res.status(500).json({ message: "failed", data: error.message }));
    
            const mcvalue = await Monmoncoin.findOne({ name: "Monster Coin" })
            .then(async mc => {
                const ads = await Ads.findOne().then(data => {
                return data.amount;
                });
    
                const investor = await Investorfunds.findOne().then(data => {
                return data.amount;
                });
    
                try {
                const header = await Gameactivity.findOne();
                const grind = await Communityactivity.findOne({ type: "grinding" });
                const quest = await Communityactivity.findOne({ type: "quest" });
    
                const value = grind.amount + quest.amount + header.total + ads + investor;
                const fnal = value / mc.amount;
                return fnal;
                } catch (error) {
                console.error("Error in findOne calls:", error);
                throw error; // Re-throw the error to be caught by the outer catch block
                }
            })
            .catch(error => res.status(500).json({ message: "failed", data: error.message }));
            
            const mmttoken = await Token.findOne({owner: user._id, type: "MMT"}).then(e => e ? e.amount : 0)
            const mcttoken = await Token.findOne({owner: user._id, type: "MCT"}).then(e => e ? e.amount : 0)
    
            const activitypoints = data.find(e => e.wallettype === "activitypoints")
            const adspoints = data.find(e => e.wallettype === "adspoints")
            const purchasepoints = data.find(e => e.wallettype === "purchasepoints")
            const taskpoints = data.find(e => e.wallettype === "taskpoints")
            const recruitpoints = data.find(e => e.wallettype === "directpoints")
            const totalpoints = data.find(e => e.wallettype === "totalpoints")
            const monstergemfarm = data.find(e => e.wallettype === "monstergemfarm")
            const monstergemunilevel = data.find(e => e.wallettype === "monstergemunilevel")
            const monstercoin = data.find(e => e.wallettype === "monstercoin")
            const balance = data.find(e => e.wallettype === "balance")
            const totalincome = data.find(e => e.wallettype === "totalincome")
            const grouppoints = data.find(e => e.wallettype === "grouppoints")
            const subscriberincome = (monstercoin.amount * mcvalue)
            const summary = {
                "activitypoints": activitypoints.amount,
                "adspoints": adspoints.amount,
                "purchasepoints": purchasepoints.amount,
                "taskpoints": taskpoints.amount,
                "recruitpoints": recruitpoints.amount,
                "totalpoints": totalpoints.amount,
                "monstergemfarm": monstergemfarm.amount,
                "monstergemunilevel": monstergemunilevel.amount,
                "monstercoin": monstercoin.amount,
                "balance": balance.amount,
                "totalincome": totalincome.amount,
                "subscriberincome": subscriberincome,
                "email": playerdetails.email,
                "phone": playerdetails.phone,
                'poolstatus': pooldetail.status,
                'poolrank': pooldetail.rank,
                "grouppoints": grouppoints?.amount,
                "mmt": mmttoken,
                "mct": mcttoken,
            }

        await WalletsCutoff.find({owner: user._id})
        .then(async item => {

            const activitypoints = item.find(e => e.wallettype === "activitypoints")
            const adspoints = item.find(e => e.wallettype === "adspoints")
            const purchasepoints = item.find(e => e.wallettype === "purchasepoints")
            const taskpoints = item.find(e => e.wallettype === "taskpoints")
            const recruitpoints = item.find(e => e.wallettype === "directpoints")
            const totalpoints = item.find(e => e.wallettype === "totalpoints")
            const grouppoints = item.find(e => e.wallettype === "grouppoints")

            const percutoff = {
                "activitypoints": activitypoints.amount,
                "adspoints": adspoints.amount,
                "purchasepoints": purchasepoints.amount,
                "taskpoints": taskpoints.amount,
                "recruitpoints": recruitpoints.amount,
                "totalpoints": totalpoints.amount,
                "grouppoints": grouppoints?.amount,
            }

            res.json({message: "success", data: summary, data2: percutoff})
        })
        .catch(error => res.status(500).json({ message: "failed", data: error.message }));
    
            
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
   
}

exports.changepassmember = (req, res) => {
    const {username, password} = req.body;

    Gameusers.findOne({username: username})
    .then(async user => {
        if(user){
            if(user.status === "banned"){
                res.json({message: "failed", data: 'This account has been banned'})
            } else {
                let newpassword = await encrypt(password)
                Gameusers.findOneAndUpdate({username: username}, {password: newpassword})
                .then(() => {
                    res.json({message: "success", data: "Password has been successfully change"})
                })
                .catch(error => res.status(400).json({ message: "falied", data: error.message }));
            }
        } else {
            res.json({message: "failed", data: "Password does not match"})
        }
    })
    .catch(error => res.status(400).json({ message: "falied", data: error.message }));
}

exports.updatememberdetail = (req, res) => {
    const { username, email, phone } = req.body
    Gameusers.findOne({username: username})
    .then(user => {
        Playerdetails.findOneAndUpdate({owner: user._id}, {email: email, phone: phone}, {new: true})
        .then(data => {
            res.json({message: "success", data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.memberwallethistory = (req, res) => {
    const { username } = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        Wallethistory.find({owner: user._id})
        .sort({createdAt: -1})
        .then(data => {
            res.json({message: 'success', data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.joined = async (req, res) => {
    try {
        // Count of overall gameusers data
        const overallGameusersCount = await Gameusers.countDocuments({status: 'active'});

        // Count of gameusers data for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayGameusersCount = await Gameusers.countDocuments({ createdAt: { $gte: today }, status: 'active' });

        // Count of pooldetails data based on subscription value
        const pearlCount = await Pooldetails.countDocuments({ subscription: 'Pearl' });
        const rubyCount = await Pooldetails.countDocuments({ subscription: 'Ruby' });
        const emeraldCount = await Pooldetails.countDocuments({ subscription: 'Emerald' });
        const diamondCount = await Pooldetails.countDocuments({ subscription: 'Diamond' });

        const summary = {
            "totaljoin": overallGameusersCount,
            'todayjoin': todayGameusersCount,
            'pearl': pearlCount,
            'ruby': rubyCount,
            'emerald': emeraldCount,
            'diamond': diamondCount,
        }

        // Respond with the counts
        res.json({message: 'success', data: summary});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.banmember = (req, res) => {
    const { username , reason } = req.body

    const ban = {
        status: 'banned',
        bandate: new Date().toLocaleString(),
        banreason: reason
    }
    Gameusers.findOneAndUpdate({username: username}, ban)
    .then(data => {
        if(data){
            res.json({message: 'success'})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.banmultiplemember = (req, res) => {
    const { usernames , reason } = req.body

    const ban = {
        status: 'banned',
        bandate: new Date().toLocaleString(),
        banreason: reason
    }

    Gameusers.updateMany({username: { $in: usernames }}, ban)
    .then(data => {
        if(data){
            res.json({message: 'success'})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.unbanmember = (req, res) => {
    const { username } = req.body

    const unban = {
        status: 'active',
        bandate: '',
        banreason: ''
    }

    Gameusers.findOneAndUpdate({username: username}, unban)
    .then(data => {
        if(data){
            res.json({message: 'success'})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.unbanmultiplemember = (req, res) => {
    const { usernames } = req.body

    const unban = {
        status: 'active',
        bandate: '',
        banreason: ''
    }

    Gameusers.updateMany({username: { $in: usernames }}, unban)
    .then(data => {
        if(data){
            res.json({message: 'success'})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.memberbannedlist = (req, res) => {

    Gameusers.find({status: "banned"})
    .select('bandate username banreason')
    .then(data => {
        if(data){
            res.json({message: 'success', data: data})
        }
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.bannedcount = async (req, res) => {
    try {
        // Count of overall gameusers data
        const overallGameusersCount = await Gameusers.countDocuments({ status: 'banned' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        function convertToCustomFormat(dateStr) {
            const dateObj = new Date(dateStr);
            return dateObj;
        }

        const todays = convertToCustomFormat(today);

        // Find documents with bandate greater than or equal to today
        const todayGameusersCount = await Gameusers.find({ 
            status: 'banned',
            bandate: { $gte: todays.toLocaleString() }
        });

        const summary = {
            totalbanned: overallGameusersCount,
            todaybanned: todayGameusersCount.length, // Use length to get the count
        };

        // Respond with the counts
        res.json({ message: 'success', data: summary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.filterwallet = (req, res) => {
    const { filter, username } = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        Wallethistory.find({owner: user._id, type: filter})
        .then(data => {
            res.json({message: 'success', data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.findtopearners = (req, res) => {

    Walletscutoff.aggregate([
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
            $limit: 100
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
    ])
    .then(data => {
        res.json({ message: "success", data: data });
    })
    .catch((error) => res.status(500).json({ message: "failed", error: error.message }));

}

exports.findnetwork = async (req, res) => {
    const { username } = req.body;
    const id = await Gameusers.findOne({ username: username })
        .then((user) => {
            return user._id;
        });

    const downline = await Gameusers.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id),
            },
        },
        {
            $graphLookup: {
                from: "gameusers",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "referral",
                as: "ancestors",
                depthField: "level",
            },
        },
        {
            $unwind: "$ancestors",
        },
        {
            $replaceRoot: { newRoot: "$ancestors" },
        },
        {
            $addFields: {
                level: { $add: ["$level", 1] },
            },
        },
        {
            $lookup: {
                from: "pooldetails",
                localField: "_id", // Use the _id from ancestors
                foreignField: "owner",
                as: "subscriptionDetails",
            },
        },
        {
            $project: {
                _id: 0, // Exclude _id field
                username: 1,
                level: 1,
                subscription: { $arrayElemAt: ["$subscriptionDetails.subscription", 0] },
            },
        },
        {
            $group: {
                _id: "$level",
                data: { $push: "$$ROOT" },
            },
        },
        {
            $sort: { _id: 1 }, // Sort by level
        },
        {
            $match: {
                _id: { $lte: 10 } // Only include levels up to 10
            }
        }
    ]);

    return res.json({message: 'success', data: downline});
};

exports.fiesta = async(req, res) => {
    const { type } = req.body

    // Fiesta.find({type: type})
    // .populate({
    //     path: "owner",
    //     select: "username"
    // })
    // .sort({amount: -1})
    // .limit(15)
    // .then(data => {
    //     res.json({message: "success", data: data})
    // })
    // .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));

    await Fiesta.find({type: type, amount: { $gt: 0 }})
    .populate({
        path: "owner",
        select: "username"
    })
    .sort({amount: -1})
    .limit(15)
    .then(async data => {
        if (data.length <= 0){
            return res.json({message: "success", data: {}})
        }

        const finaldata = {
            leaderboard: {}
        }

        index = 0;
        data.forEach(lbdata => {
            finaldata["leaderboard"][index] = {
                score: lbdata.amount,
                username: lbdata.owner.username
            }

            index++
        })

        const prizepool = await Prizepools.findOne({type: type})
        .then(data => data)
        .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))

        finaldata["prizepools"] = prizepool.amount;

        return res.json({message: "success", data: finaldata})
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))

}

exports.sponsor = (req, res) => {
    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    };

    Sponsor.find()
    .populate({
        path: "owner",
        select: "username"
    })
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .sort({createdAt: -1})
    .then(data => {
        Sponsor.countDocuments()
        .then(count => {
            const totalPages = Math.ceil(count / pageOptions.limit)
            res.json({ message: "success", data: data, pages: totalPages})
        })
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));

}

exports.getmembertools = (req, res) => {
    const { username } = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        Equipment.find({owner: user._id})
        .then(data => {
            res.json({message: "success", data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.getmemberclock = (req, res) => {
    const {username} = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        Clock.find({owner: user._id})
        .then(data => {
            res.json({message: "success", data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));

}

exports.getmembercosmetics = (req, res) => {
    const {username, type} = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        Cosmetics.find({owner: user._id, type: type})
        .then(data => {
            res.json({message: "success", data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.getmembersupplies = (req, res) => {
    const {username, type} = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        Energyinventories.find({owner: user._id, type: type})
        .then(data => {
            res.json({message: "success", data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.getmemberpaydetail = (req, res) => {
    const {username} = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        DragonPaymentdetails.findOne({owner: user._id})
        .then(data => {
            res.json({message: 'success', data: data})
        })
        .catch(error => res.status(500).json({ message: "failed", data: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    
}

exports.paymentdetail = async (req, res) => {
    const { 
        firstname,
        middlename,
        lastname,
        email,
        mobilenumber,
        birthdate,
        nationality,
        street1, 
        street2, 
        barangay, 
        city, 
        province, 
        country,
        paymentmethod,
        paymentdetail,
        username
    } = req.body
    const id = await Gameusers.findOne({username: username}).then(data => data._id)
    const currency = paymentmethod == 'CRYPTO' ? 'USDT' : 'PHP'
    const paymentoption = paymentmethod == 'CRYPTO' ? 'Manual' : 'Automatic'

    const forgame = {
        owner: id,
        paymentoption: paymentoption,
        paymentmethod: paymentmethod,
        currency: currency
    }

    const fordragonpay = {
        owner: id,
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        email: email,
        mobilenumber: mobilenumber,
        birthdate: birthdate,
        nationality: nationality,
        address: {
            Street1: street1,
            Street2: street2,
            Barangay: barangay,
            City: city,
            Province: province,
            Country: country
        },
        paymentmethod: paymentmethod,
        paymentdetail: paymentdetail
    }

    const isexsist = await Paymentdetails.findOne({owner: id})
    .then(data => {
        if(data){
            return true
        } else {
            return false
        }
    })
    .catch(error => res.status(500).json({ message: "failed", data: error.message }));

    const isexsist1 = await DragonPaymentdetails.findOne({owner: id})
    .then(data => {
        if(data){
            return true
        } else {
            return false
        }
    })
    .catch(error => res.status(500).json({ message: "failed", data: error.message }));

    if(isexsist && isexsist1){
        await Paymentdetails.findOneAndUpdate({owner: id}, forgame)
        await DragonPaymentdetails.findOneAndUpdate({owner: id}, fordragonpay)

        res.json({message: "success", data: "Save Successfully"})
    } else {
        await Paymentdetails.create(forgame)
        await DragonPaymentdetails.create(fordragonpay)

        res.json({message: "success", data: "Save Successfully"})
    }

}

exports.getmembertask = async (req, res) => {
    const { username } = req.body

    const id = await Gameusers.findOne({username: username}).then(data => data._id)
    const pool = await Pooldetails.findOne({owner: id}).then(data => data)

    const summary = {
        "subscription": pool.subscription,

    }

    res.json({message: "success", data: summary})
}

exports.gameannouncement = (req, res) => {
    const { title, description } = req.body

    const data = {
        title: title,
        description: description
    }

    Gameannouncement.create(data)
    .then((data) => {
        res.json({message: 'success', data: data})
    })
    .catch(error => res.status(500).json({ message: "failed", data: error.message }));
}

exports.maintenance = (req, res) => {
    const {type, value} = req.body

    Maintenance.findOneAndUpdate({type: type}, {value: value})
    .then(data => {
        if(data){
            res.json({message: "success"})
        }
    })
    .catch(error => res.status(500).json({ message: "failed", data: error.message }));
}

exports.maintenancevalue = (req, res) => {

    Maintenance.find()
    .select('type value')
    .then(data => {
        const maintenancefullgame = data.find(e => e.type == "maintenancefullgame")
        const maintenancegrinding = data.find(e => e.type == "maintenancegrinding")
        const maintenancesubscription = data.find(e => e.type == "maintenancesubscription")
        const maintenanceitems = data.find(e => e.type == "maintenanceitems")
        const maintenancefiestagame = data.find(e => e.type == "maintenancefiestagame")
        const maintenancesponsor = data.find(e => e.type == "maintenancesponsor")
        const maintenancecashoutmanual = data.find(e => e.type == "maintenancecashoutmanual")
        const maintenancecashoutautomated = data.find(e => e.type == "maintenancecashoutautomated")
        const maintenancecashinmanual = data.find(e => e.type == "maintenancecashinmanual")
        const maintenancecashinautomated = data.find(e => e.type == "maintenancecashinautomated")

        const summary = {
            "maintenancefullgame": maintenancefullgame,
            "maintenancegrinding": maintenancegrinding,
            "maintenancesubscription": maintenancesubscription,
            "maintenanceitems": maintenanceitems,
            "maintenancefiestagame": maintenancefiestagame,
            "maintenancesponsor": maintenancesponsor,
            "maintenancecashoutmanual": maintenancecashoutmanual,
            "maintenancecashoutautomated": maintenancecashoutautomated,
            "maintenancecashinmanual": maintenancecashinmanual,
            "maintenancecashinautomated": maintenancecashinautomated,
        }

        res.json({message: "success", data: summary})
    })
    .catch(error => res.status(500).json({ message: "failed", data: error.message }));
}

exports.getcurrentrank = async (req, res) => {
    const { username } = req.body
    const id = await Gameusers.findOne({username: username}).then(data => data._id)
    const playerlb = await Ingameleaderboard.findOne({owner: new mongoose.Types.ObjectId(id)})
    .then(data => data)
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))

    if (!playerlb){
        return res.status(404).json({ message: 'notfound' })
    }

    const rank = await Ingameleaderboard.countDocuments({amount: { $gte: playerlb.amount}})
    .then(data => data)
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))

    res.json({message: "success", data: rank})

}

exports.grantenergy = (req, res) => {
    const {username, quantity, name} = req.body
    let grant;
    let id;

    Gameusers.findOne({username: username})
    .then(async (user) => {
        if(user){
            id = user._id
            Energyinventories.findOne({owner: user._id, name: name})
            .then(async (item) => {
                if(item){
                    await Energyinventories.findOneAndUpdate({owner: user._id, name: name}, {$inc: {amount: quantity}})
                    .then((data) => {
                        if(data){
                            res.json({message: "success"})
                        } else {
                            res.json({message: "failed", data: "Energy type not found"})
                        }
                    })
                    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                } else {
                    switch(name){
                        case "1":
                        grant = {
                            owner: id,
                            name: "1",
                            type: "energy",
                            amount: quantity,
                            consumableamount: 1
                        }
                        break;
                        case "2":
                            grant = {
                                owner: id,
                                name: "2",
                                type: "energy",
                                amount: quantity,
                                consumableamount: 5
                            }
                        break;
                        case "3":
                            grant = {
                                owner: id,
                                name: "3",
                                type: "energy",
                                amount: quantity,
                                consumableamount: 10
                            }
                        break;
                        case "4":
                            grant = {
                                owner: id,
                                name: "4",
                                type: "energy",
                                amount: quantity,
                                consumableamount: 20
                            }
                        break;
                        case "5":
                            grant = {
                                owner: id,
                                name: "5",
                                type: "energy",
                                amount: quantity,
                                consumableamount: 50
                            }
                        break;
                    }

                    await Energyinventories.create(grant)
                    .then(() => {
                        res.json({message: "success"})
                    })
                    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                }
            })
            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))

            
        } else {
            res.json({message: "failed", data: "user not found"})
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.granttool = async (req, res) => {
    const { username, type, expiration } = req.body

   const timeifowned =  DateTimeServerExpiration2(expiration)
   const timeifnotowned = DateTimeServerExpiration1(expiration)

    Gameusers.findOne({username: username})
    .then((user) => {
        if(user){
            Equipment.findOne({owner: user._id, type: type})
            .then((item) => {
                if(item.isowned == "1"){
                    Equipment.findOneAndUpdate({owner: user._id, type: type}, { $inc: { expiration: timeifowned }})
                    .then((data) => {
                        if(data){
                            res.json({message: "success"})
                        }
                    })
                    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                } else {
                    Equipment.findOneAndUpdate({owner: user._id, type: type}, { expiration: timeifnotowned, $set: { isowned: "1" } })
                    .then((data) => {
                        if(data){
                            res.json({message: "success"})
                        }
                    })
                    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                }
            })
            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
        } else {
            res.json({message: "failed", data: "user not found"})
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.grantclock = (req, res) => {
    const { username, type, expiration } = req.body

    const timeifowned =  DateTimeServerExpiration2(expiration)
    const timeifnotowned = DateTimeServerExpiration1(expiration)

    Gameusers.findOne({username: username})
    .then((user) => {
        if(user){
            Clock.findOne({owner: user._id, type: type})
            .then((item) => {
                if(item.isowned == "1"){
                    Clock.findOneAndUpdate({owner: user._id, type: type}, { $inc: { expiration: timeifowned }})
                    .then((data) => {
                        if(data){
                            res.json({message: "success"})
                        }
                    })
                    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                } else {
                    Clock.findOneAndUpdate({owner: user._id, type: type}, { expiration: timeifnotowned, $set: { isowned: "1" } })
                    .then((data) => {
                        if(data){
                            res.json({message: "success"})
                        }
                    })
                    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                }
            })
            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
        } else {
            res.json({message: "failed", data: "user not found"})
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.grantcosmetic = (req, res) => {
    const {username, name, expiration} = req.body
    const timeifowned =  DateTimeServerExpiration2(expiration)
    const timeifnotowned = DateTimeServerExpiration1(expiration)
    let grant;
    let id;

    Gameusers.findOne({username: username})
    .then((user) => {
        if(user){
            id = user._id
            Cosmetics.findOne({owner: id, name: name})
            .then(async (data) => {
                if(data){
                    if(data.permanent === "permanent"){
                        res.json({message: "failed", data: `user already owned a permanent ${name} ring.`})
                    } else if ( data.permanent === "nonpermanent"){
                       await Cosmetics.findOneAndUpdate({owner: id, name: name}, {$inc : {expiration: timeifowned}})
                       .then((item) => {
                            if(item){
                                res.json({message: "success"})
                            }
                       })
                       .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                    }
                } else {
                    switch(name){
                        case "Ruby":
                        grant = {
                            owner: id,
                            name: "Ruby",
                            type: "ring",
                            expiration: timeifnotowned,
                            permanent: "nonpermanent",
                            isequip: "0"
                        }
                        break;
                        case "Emerald":
                        grant = {
                            owner: id,
                            name: "Emerald",
                            type: "ring",
                            expiration: timeifnotowned,
                            permanent: "nonpermanent",
                            isequip: "0"
                        }
                        break;
                        case "Diamond":
                        grant = {
                            owner: id,
                            name: "Diamond",
                            type: "ring",
                            expiration: timeifnotowned,
                            permanent: "nonpermanent",
                            isequip: "0"
                        }
                        break;
                        case "Energy":
                        grant = {
                            owner: id,
                            name: "Energy",
                            type: "ring",
                            expiration: timeifnotowned,
                            permanent: "nonpermanent",
                            isequip: "0"
                        }
                        break;
                    }

                    await Cosmetics.create(grant)
                    .then(() => {
                        res.json({message: "success"})
                    })
                    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                }
                
            })
            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))

        } else {
            res.json({message: "failed", data: "no user found"})
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.grantbalance = (req, res) => {
    const {username, amount, description} = req.body

    Gameusers.findOne({username: username})
    .then((user) => {
        if(user){
            Wallets.findOne({owner: user._id, wallettype: "balance"})
            .then(async (wallet) => {
                if(wallet){
                    await Wallets.findOneAndUpdate({owner: user._id, wallettype: "balance"}, {$inc: {amount: amount}})
                    .then(async (item) => {
                        if(item){
                            const history = {
                                owner: user._id,
                                type: "Game Event Prize",
                                description: description,
                                historystructure: `granted by ${req.user.username}:  ${description} `,
                                amount: amount
                            }
                           await Wallethistory.create(history)
                           res.json({message: "success"})
                        }
                    })
                    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                } else {
                    res.json({message: "failed", data: "wallet not found"})
                }
            })
            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
        } else {
            res.json({message: "failed", data: "user not found"})
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.grantmonstercoin = (req, res) => {
    const {username, amount, description, checked} = req.body

    Gameusers.findOne({username: username})
    .then((user) =>{
        if(user){
            Wallets.findOne({owner: user._id, wallettype: "monstercoin"})
            .then(async (wallet) => {
                if(checked){
                   const mclimit = await checkmclimit(amount)

                   if(mclimit === false){
                        if(wallet){
                            await Wallets.findOneAndUpdate({owner: user._id, wallettype: "monstercoin"}, {$inc: {amount: amount}})
                            .then(async (item) => {
                                if(item){
                                    const history = {
                                        owner: user._id,
                                        type: "Game Event Prize",
                                        description: description,
                                        historystructure: `granted by ${req.user.username}:  ${description} `,
                                        amount: amount
                                    }
                                await Monmoncoin.findOneAndUpdate({name: "Monster Coin"}, {$inc: {amount: amount}})
                                await Wallethistory.create(history)
                                res.json({message: "success"})
                                }
                            })
                            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                        } else {
                            res.json({message: "failed", data: "wallet not found"})
                        }
                   } else {
                    res.json({message: "failed", data: "Warning: The granted amount will exceed the total Monster Coin Farm limit."})
                    return
                   }
                } else {
                    if(wallet){
                        await Wallets.findOneAndUpdate({owner: user._id, wallettype: "monstercoin"}, {$inc: {amount: amount}})
                        .then(async (item) => {
                            if(item){
                                const history = {
                                    owner: user._id,
                                    type: "Game Event Prize",
                                    description: description,
                                    historystructure: `granted by ${req.user.username}:  ${description} `,
                                    amount: amount
                                }
                               await Wallethistory.create(history)
                               res.json({message: "success"})
                            }
                        })
                        .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                    } else {
                        res.json({message: "failed", data: "wallet not found"})
                    }
                }
               
            })
            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
        } else {
            res.json({message: "failed", data: "user not found"})
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.grantmonstergem = (req, res) => {
    const {username, amount, description, checked} = req.body

    Gameusers.findOne({username: username})
    .then((user) =>{
        if(user){
            Wallets.findOne({owner: user._id, wallettype: "monstergemunilevel"})
            .then(async (wallet) => {
                if(checked){
                    const mglimit = await checkmglimit(amount)

                    if(mglimit === false){
                        if(wallet){
                            await Wallets.findOneAndUpdate({owner: user._id, wallettype: "monstergemunilevel"}, {$inc: {amount: amount}})
                            .then(async (item) => {
                                if(item){
                                    const history = {
                                        owner: user._id,
                                        type: "Game Event Prize",
                                        description: description,
                                        historystructure: `granted by ${req.user.username}:  ${description} `,
                                        amount: amount
                                    }
                                    await Monmoncoin.findOneAndUpdate({name: "Monster Gem"}, {$inc: {amount: amount}})
                                   await Wallethistory.create(history)
                                   res.json({message: "success"})
                                }
                            })
                            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                        } else {
                            res.json({message: "failed", data: "wallet not found"})
                        }
                    } else {
                        res.json({message: "failed", data: "Warning: The granted amount will exceed the total Monster Gem Farm limit."})
                        return
                    }
                } else {
                    if(wallet){
                        await Wallets.findOneAndUpdate({owner: user._id, wallettype: "monstergemunilevel"}, {$inc: {amount: amount}})
                        .then(async (item) => {
                            if(item){
                                const history = {
                                    owner: user._id,
                                    type: "Game Event Prize",
                                    description: description,
                                    historystructure: `granted by ${req.user.username}:  ${description} `,
                                    amount: amount
                                }
                               await Wallethistory.create(history)
                               res.json({message: "success"})
                            }
                        })
                        .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                    } else {
                        res.json({message: "failed", data: "wallet not found"})
                    }
                }
                
            })
            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
        } else {
            res.json({message: "failed", data: "user not found"})
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.createsponsorprize = (req, res) => {
    const {
        itemnumber,
        itemname,
        itemtype,
        itemid,
        amount,
        expiration,
        qty,
        percentage,
        isprize } = req.body

    const prize = {
        itemnumber: itemnumber,
        itemname: itemname,
        itemtype: itemtype,
        itemid: itemid,
        amount: amount,
        expiration: expiration,
        qty: qty,
        percentage: percentage,
        isprize: isprize }
    
    Sponsorlist.create(prize)
    .then(data => {
        if(data){
            res.json({message: "success"})
        }
    })  
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.findsponsorprize = (req, res) => {
    
    Sponsorlist.find()
    .sort({itemnumber: 1})
    .then(data => {
        if(data){
            res.json({message: "success", data: data})
        }
    })  
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.sponsorprizeonandoff = (req, res) => {
    const { isprize } = req.body

    Sponsorlist.findOneAndUpdate({_id: new mongoose.Types.ObjectId(req.params) }, {isprize: isprize})
    .then((data) => {
        if(data){
            res.json({message: "success"})
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.sponsorprizedelete = (req, res) => {

    Sponsorlist.findByIdAndDelete({_id: new mongoose.Types.ObjectId(req.params)})
    .then((data) => {
        if(data){
            res.json({message: "success"})
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.editsponsorprize = (req, res) => {

    const {
        itemnumber,
        itemname,
        itemtype,
        itemid,
        amount,
        expiration,
        qty,
        percentage,
        isprize
    } = req.body

    // Validate that keys with empty values are not included
    const validKeys = {
        itemnumber,
        itemname,
        itemtype,
        itemid,
        amount,
        expiration,
        qty,
        percentage,
        isprize
    }
    console.log(validKeys)
    const prize = Object.entries(validKeys)
        .filter(([key, value]) => value !== undefined  && value !== '')
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

    if (Object.keys(prize).length === 0) {
        return res.status(400).json({ message: "failed", data: "No valid data provided" })
    }

    Sponsorlist.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.params) }, prize)
    .then(data => {
        if (data) {
            res.json({ message: "success" })
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.gettransactionhistory = (req, res) => {
    const { username } = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        Analytics.find({owner: user._id})
        .sort({createdAt: -1})
        .then(data => {
            res.json({message: 'success', data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.getgrindinghistory = (req, res) => {
    const { username } = req.body

    Gameusers.findOne({username: username})
    .then(user => {
        GrindingHistory.find({owner: user._id})
        .sort({createdAt: -1})
        .then(data => {
            res.json({message: 'success', data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.filtertransaction = (req, res) => {
    const { filter, username } = req.body

    Gameusers.findOne({ username: username })
        .then(user => {
            const regex = new RegExp(filter, 'i'); // 'i' for case-insensitive
            Analytics.find({ owner: user._id, type: { $regex: regex } })
                .then(data => {
                    res.json({ message: 'success', data: data })
                })
                .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
        })
        .catch((error) => res.status(500).json({ message: "failed", error: error.message }));
}

exports.filtergrinding = (req, res) => {
    const { filter, username } = req.body

    // Create a date range for the entire day
    const startDate = new Date(filter);
    startDate.setHours(0, 0, 0, 0); // Set to the beginning of the day
    const endDate = new Date(filter);
    endDate.setHours(23, 59, 59, 999); // Set to the end of the day

    Gameusers.findOne({username: username})
    .then(user => {
        GrindingHistory.find({owner: user._id, createdAt: { $gte: startDate, $lte: endDate }})
        .then(data => {
            res.json({message: 'success', data: data})
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.getpayables = async(req, res) => {
    const { filterValue } = req.body
    const pipeline = [
        {
          $match: {
            wallettype: "balance",
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
          },
        },
      ];
      
      if (filterValue == "10") {
        pipeline[0].$match.amount = { $gte: parseInt(filterValue, 10) };
      }
      
      try {
        const result = await Wallets.aggregate(pipeline);
      
        const totalAmount = result.length > 0 ? result[0].totalAmount : 0;
      
        res.json({ message: "success", data:  totalAmount  });
      } catch (err) {
        res.json({ message: "failed", data: err.message });
      }

}

exports.getpayableshistory = async(req, res) => {
    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    };

    try {
        Payablehistory.find()
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .sort({'createdAt': 1})
        .then(user => {
            Payablehistory.countDocuments()
            .then(count => {
                const totalPages = Math.ceil(count / pageOptions.limit)
                res.json({ message: "success", data: user, pages: totalPages })
            })
            .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
        })
        .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
    } catch (err) {
    res.json({ message: "failed", data: err.message });
    }

}

exports.makeplayeractive = (req, res) => {

    const { username } = req.body

    Gameusers.findOne({username: username})
    .then(async data => {

        const userdata = new Gameusers ({
            _id: new mongoose.Types.ObjectId(data._id),
            username: data.username,
            password: data.password,
            status: "active",
            referral: new mongoose.Types.ObjectId(data.referral),
            token: "",
            webtoken: ""
        })
        
        await Gameusers.deleteOne({username: username})
        await Gameusers.create(userdata)
        return res.json({message: 'success'})
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    
}

exports.grantmmt = async (req, res) => {
    const {amount, tokentoreceive, username, description, ischecked} = req.body
    const customid = nanoid(10)
    Gameusers.findOne({username: username})
    .then(async user => {
        if(user){
            Token.findOne({owner: user._id ,type: "MMT"})
            .then(async token => {
                if(token){
                    if(ischecked){
                        const tokenlimit = await checktokenlimit(tokentoreceive, "MMT")

                        if(tokenlimit === false){
                            const tokenhistory = {
                                owner: user._id,
                                id: customid,
                                type: "MMT",
                                tokenreceive: tokentoreceive,
                                amount: amount
                            }

                            const wallethistory = {
                                owner: user._id,
                                type: "Granted MMT Token",
                                description: description,
                                amount: amount,
                                historystructure: `granted by ${req.user.username}: ${description}`
                            }

                            await Wallethistory.create(wallethistory)
                            await Buytokenhistory.create(tokenhistory)
                            await Token.findOneAndUpdate({owner: user._id ,type: "MMT"}, {$inc: {amount: tokentoreceive}})
                            res.json({message: "success"})
                        } else {
                            res.json({message: "failed", data: "Warning: The granted token amount will exceed the total supply limit"})
                        }
                    } else {

                        const wallethistory = {
                            owner: user._id,
                            type: "Granted MMT Token",
                            description: description,
                            amount: amount,
                            historystructure: `granted by ${req.user.username}: ${description}`
                        }

                        await Wallethistory.create(wallethistory)
                        await Token.findOneAndUpdate({owner: user._id ,type: "MMT"}, {$inc: {amount: tokentoreceive}})
                        res.json({message: "success"})
                    }

                } else {

                    if(ischecked){
                        const tokenlimit = await checktokenlimit(tokentoreceive, "MMT")

                        if(tokenlimit === false){
                            const tokenwallet = {
                                owner: user._id,
                                type: "MMT",
                                amount: tokentoreceive
                            }
                            
                            await Token.create(tokenwallet)

                            const tokenhistory = {
                                owner: user._id,
                                id: customid,
                                type: "MMT",
                                tokenreceive: tokentoreceive,
                                amount: amount
                            }

                            const wallethistory = {
                                owner: user._id,
                                type: "Granted MMT Token",
                                description: description,
                                amount: amount,
                                historystructure: `granted by ${req.user.username}: ${description}`
                            }

                            await Wallethistory.create(wallethistory)
                            await Buytokenhistory.create(tokenhistory)
                            res.json({message: "success"})
                        } else {
                            res.json({message: "failed", data: "Warning: The granted token amount will exceed the total supply limit"})
                        }
                    } else {

                        const tokenwallet = {
                            owner: user._id,
                            type: "MMT",
                            amount: tokentoreceive
                        }
                        
                        await Token.create(tokenwallet)

                        const wallethistory = {
                            owner: user._id,
                            type: "Granted MMT Token",
                            description: description,
                            amount: amount,
                            historystructure: `granted by ${req.user.username}: ${description}`
                        }

                        await Wallethistory.create(wallethistory)
                        res.json({message: "success"})
                    }


                }
            })
            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
        } else {
            res.json({message: "failed", data: "user not found"})
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.grantmct = async (req, res) => {
    const {amount, tokentoreceive, username, description, ischecked} = req.body
    const customid = nanoid(10)
    Gameusers.findOne({username: username})
    .then(async user => {
        if(user){
            Token.findOne({owner: user._id ,type: "MCT"})
            .then(async token => {
                if(token){
                    if(ischecked){
                        const tokenlimit = await checktokenlimit(tokentoreceive, "MCT")
                        if(tokenlimit === false){
                            const tokenhistory = {
                                owner: user._id,
                                id: customid,
                                type: "MCT",
                                tokenreceive: tokentoreceive,
                                amount: amount
                            }

                            const wallethistory = {
                                owner: user._id,
                                type: "Granted MCT Token",
                                description: description,
                                amount: amount,
                                historystructure: `granted by ${req.user.username}: ${description}`
                            }

                            await Wallethistory.create(wallethistory)
                            await Buytokenhistory.create(tokenhistory)
                            await Token.findOneAndUpdate({owner: user._id ,type: "MCT"}, {$inc: {amount: tokentoreceive}})
                            res.json({message: "success"})
                        } else {
                            res.json({message: "failed", data: "Warning: The granted token amount will exceed the total supply limit"})
                        }
                    } else {

                        const wallethistory = {
                            owner: user._id,
                            type: "Granted MCT Token",
                            description: description,
                            amount: amount,
                            historystructure: `granted by ${req.user.username}: ${description}`
                        }

                        await Wallethistory.create(wallethistory)
                        await Token.findOneAndUpdate({owner: user._id ,type: "MCT"}, {$inc: {amount: tokentoreceive}})
                        res.json({message: "success"})
                    }

                } else {

                    if(ischecked){
                        const tokenlimit = await checktokenlimit(tokentoreceive, "MCT")

                        if(tokenlimit === false){
                            const tokenwallet = {
                                owner: user._id,
                                type: "MCT",
                                amount: tokentoreceive
                            }
                            
                            await Token.create(tokenwallet)

                            const tokenhistory = {
                                owner: user._id,
                                id: customid,
                                type: "MCT",
                                tokenreceive: tokentoreceive,
                                amount: amount
                            }

                            const wallethistory = {
                                owner: user._id,
                                type: "Granted MCT Token",
                                description: description,
                                amount: amount,
                                historystructure: `granted by ${req.user.username}: ${description}`
                            }

                            await Wallethistory.create(wallethistory)
                            await Buytokenhistory.create(tokenhistory)
                            res.json({message: "success"})
                        } else {
                            res.json({message: "failed", data: "Warning: The granted token amount will exceed the total supply limit"})
                        }
                    } else {

                        const tokenwallet = {
                            owner: user._id,
                            type: "MCT",
                            amount: tokentoreceive
                        }
                        
                        await Token.create(tokenwallet)

                        const wallethistory = {
                            owner: user._id,
                            type: "Granted MCT Token",
                            description: description,
                            amount: amount,
                            historystructure: `granted by ${req.user.username}: ${description}`
                        }

                        await Wallethistory.create(wallethistory)
                        res.json({message: "success"})
                    }


                }
            })
            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
        } else {
            res.json({message: "failed", data: "user not found"})
        }
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.memberbuytokenhistory = (req, res) => {
    const { username } = req.body

    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    };

    Gameusers.findOne({username: username})
    .then(user => {
        Buytokenhistory.find({owner: user._id})
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .sort({createdAt: -1})
        .then(data => {
            Buytokenhistory.countDocuments({owner: user._id})
            .then(count => {
                const totalPages = Math.ceil(count / pageOptions.limit)
                res.json({ message: "success", data: data, pages: totalPages })
            })
            .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.memberdeposittokenhistory = (req, res) => {
    const { username } = req.body

    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    };

    Gameusers.findOne({username: username})
    .then(user => {
        Tokentransaction.find({owner: user._id, depositAt: { $ne: null, $ne: "", $exists: true }})
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .sort({createdAt: -1})
        .then(data => {
            Tokentransaction.countDocuments({owner: user._id, depositAt: { $ne: null, $ne: "", $exists: true }})
            .then(count => {
                const totalPages = Math.ceil(count / pageOptions.limit)
                res.json({ message: "success", data: data, pages: totalPages })
            })
            .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.memberwithdrawtokenhistory = (req, res) => {
    const { username } = req.body

    const pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    };

    Gameusers.findOne({username: username})
    .then(user => {
        Tokentransaction.find({owner: user._id, claimedAt: { $ne: null, $ne: "", $exists: true }})
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .sort({createdAt: -1})
        .then(data => {
            Tokentransaction.countDocuments({owner: user._id, claimedAt: { $ne: null, $ne: "", $exists: true }})
            .then(count => {
                const totalPages = Math.ceil(count / pageOptions.limit)
                res.json({ message: "success", data: data, pages: totalPages })
            })
            .catch(error => res.status(400).json({ message: "bad-request", data: error.message}))
        })
        .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
    })
    .catch((error) => res.status(500).json({ message: "failed",  error: error.message }));
}

exports.grantmmtasreward = async (req, res) => {
    const {amount, tokentoreceive, username, description, ischecked} = req.body
    const customid = nanoid(10)

    Gameusers.findOne({username: username})
    .then(async user => {
        if(user){
            Token.findOne({owner: new mongoose.Types.ObjectId(user._id), type: "MMT"})
            .then(async token => {
                if(token){
                    if(ischecked){
                        const airdroplimit = await checkairdroplimit(tokentoreceive, "MMT")

                        if(airdroplimit == "notlimit"){
                            const airdroptokenhistory = {
                                owner: new mongoose.Types.ObjectId(user._id),
                                questid: 0,
                                questtitle: "Granted as reward",
                                mmttokenreward: parseFloat(tokentoreceive),
                            }

                            const wallethistory = {
                                owner: new mongoose.Types.ObjectId(user._id),
                                type: "Granted MMT Token",
                                description: description,
                                amount: amount,
                                historystructure: `granted by ${req.user.username}: ${description}`
                            }

                            await Wallethistory.create(wallethistory)
                            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))

                            await Airdroptransaction.create(airdroptokenhistory)
                            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))

                            await Token.findOneAndUpdate({owner: new mongoose.Types.ObjectId(user._id) ,type: "MMT"}, {$inc: {amount: tokentoreceive}})
                            .then(ey => {
                                console.log(ey)
                            })
                            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))

                            res.json({message: "success"})
                        } else {
                            res.json({message: "failed", data: "Warning!: The granted amount will exceed to the total airdrop limit supply"})
                        }
                    } else {
                        const wallethistory = {
                            owner: new mongoose.Types.ObjectId(user._id),
                            type: "Granted MMT Token",
                            description: description,
                            amount: amount,
                            historystructure: `granted by ${req.user.username}: ${description}`
                        }

                        await Wallethistory.create(wallethistory)
                        .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))

                        await Token.findOneAndUpdate({owner: new mongoose.Types.ObjectId(user._id) ,type: "MMT"}, {$inc: {amount: tokentoreceive}})
                        .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                        res.json({message: "success"})
                    }
                } else {
                    if(ischecked){
                        const airdroplimit = await checkairdroplimit(tokentoreceive, "MMT")

                        if(airdroplimit == "notlimit"){

                            const tokenwallet = {
                                owner: new mongoose.Types.ObjectId(user._id),
                                type: "MMT",
                                amount: tokentoreceive
                            }

                            await Token.create(tokenwallet)
                            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))

                            const airdroptokenhistory = {
                                owner: new mongoose.Types.ObjectId(user._id),
                                questid: 0,
                                questtitle: "Granted as reward",
                                mmttokenreward: parseFloat(tokentoreceive),
                            }

                            const wallethistory = {
                                owner: new mongoose.Types.ObjectId(user._id),
                                type: "Granted MMT Token",
                                description: description,
                                amount: amount,
                                historystructure: `granted by ${req.user.username}: ${description}`
                            }

                            await Wallethistory.create(wallethistory)
                            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                            await Airdroptransaction.create(airdroptokenhistory)
                            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                            res.json({message: "success"})
                        } else {
                            res.json({message: "failed", data: "Warning!: The granted amount will exceed to the total airdrop limit supply"})
                        }
                    } else {
                        const tokenwallet = {
                            owner: new mongoose.Types.ObjectId(user._id),
                            type: "MMT",
                            amount: tokentoreceive
                        }
                        
                        await Token.create(tokenwallet)

                        const wallethistory = {
                            owner: new mongoose.Types.ObjectId(user._id),
                            type: "Granted MMT Token",
                            description: description,
                            amount: amount,
                            historystructure: `granted by ${req.user.username}: ${description}`
                        }

                        await Wallethistory.create(wallethistory)
                        .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
                        res.json({message: "success"})
                    }
                }
            })
            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
        } else {
            res.json({message: "failed", data: "user not found"})
        } 
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}

exports.grantmctasreward = (req, res) => {
    const {amount, tokentoreceive, username, description, ischecked} = req.body
    const customid = nanoid(10)

    Gameusers.findOne({username: username})
    .then(async user => {
        if(user){
            Token.findOne({owner: user._id, type: "MCT"})
            .then(async token => {
                if(token){
                    if(ischecked){
                        const airdroplimit = await checkairdroplimit(tokentoreceive, "MCT")

                        if(airdroplimit == "notlimit"){
                            const airdroptokenhistory = {
                                owner: user._id,
                                questid: 0,
                                questtitle: "Granted as reward",
                                mcttokenreward: parseFloat(tokentoreceive),
                            }

                            const wallethistory = {
                                owner: user._id,
                                type: "Granted MCT Token",
                                description: description,
                                amount: amount,
                                historystructure: `granted by ${req.user.username}: ${description}`
                            }

                            await Wallethistory.create(wallethistory)
                            await Airdroptransaction.create(airdroptokenhistory)
                            await Token.findOneAndUpdate({owner: user._id ,type: "MCT"}, {$inc: {amount: tokentoreceive}})
                            res.json({message: "success"})
                        } else {
                            res.json({message: "failed", data: "Warning!: The granted amount will exceed to the total airdrop limit supply"})
                        }
                    } else {
                        const wallethistory = {
                            owner: user._id,
                            type: "Granted MCT Token",
                            description: description,
                            amount: amount,
                            historystructure: `granted by ${req.user.username}: ${description}`
                        }

                        await Wallethistory.create(wallethistory)
                        await Token.findOneAndUpdate({owner: user._id ,type: "MCT"}, {$inc: {amount: tokentoreceive}})
                        res.json({message: "success"})
                    }
                } else {
                    if(ischecked){
                        const airdroplimit = await checkairdroplimit(tokentoreceive, "MCT")

                        if(airdroplimit == "notlimit"){

                            const tokenwallet = {
                                owner: user._id,
                                type: "MCT",
                                amount: tokentoreceive
                            }

                            await Token.create(tokenwallet)

                            const airdroptokenhistory = {
                                owner: user._id,
                                questid: 0,
                                questtitle: "Granted as reward",
                                mcttokenreward: parseFloat(tokentoreceive),
                            }

                            const wallethistory = {
                                owner: user._id,
                                type: "Granted MCT Token",
                                description: description,
                                amount: amount,
                                historystructure: `granted by ${req.user.username}: ${description}`
                            }

                            await Wallethistory.create(wallethistory)
                            await Airdroptransaction.create(airdroptokenhistory)
                            res.json({message: "success"})
                        } else {
                            res.json({message: "failed", data: "Warning!: The granted amount will exceed to the total airdrop limit supply"})
                        }
                    } else {
                        const tokenwallet = {
                            owner: user._id,
                            type: "MCT",
                            amount: tokentoreceive
                        }
                        
                        await Token.create(tokenwallet)

                        const wallethistory = {
                            owner: user._id,
                            type: "Granted MCT Token",
                            description: description,
                            amount: amount,
                            historystructure: `granted by ${req.user.username}: ${description}`
                        }

                        await Wallethistory.create(wallethistory)
                        res.json({message: "success"})
                    }
                }
            })
            .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
        } else {
            res.json({message: "failed", data: "user not found"})
        } 
    })
    .catch(err => res.status(400).json({ message: "bad-request", data: err.message }))
}