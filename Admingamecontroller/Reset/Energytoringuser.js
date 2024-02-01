const { default: mongoose } = require("mongoose");
const { getmaxenergy, connecttodatabase, closedatabase } = require("../../Utils/utils")
const { MongoClient } = require('mongodb');
const { parentPort } = require('worker_threads')


parentPort.on('message', async (data) => {
    console.log("STARTING GRANT ENERGY TO RING USERS")

    if(data !== "energytoringuser"){
        parentPort.postMessage({message: "failed", data: "Run Task Not Found"})
        return
    }

    try {

        let client
        let database

        client = await connecttodatabase();
        database = client.db()

        const cosmeticcollection = database.collection('cosmetics')
        const energycollection = database.collection('energy')

        //  THIS IS FOR PEARL
        const pearlringenergypipeline = [
            {
                $match: {
                    name: "Pearl",
                    type: "ring",
                    isequip: "1"
                }
            },
            {
                $lookup: {
                    from: 'gameusers',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    from: 'pooldetails',
                    localField: 'owner',
                    foreignField: 'owner',
                    as: 'pooldetail'
                }
            },
            {
                $unwind: '$pooldetail'
            },
            {
                $project: {
                    _id: 0,
                    'user._id': 1,
                    'user.username': 1,
                    'pooldetail.subscription': 1
                }
            }
        ]

        const pearlringcursor = await cosmeticcollection.aggregate(pearlringenergypipeline)

        const pearlringusers = await pearlringcursor.toArray()
        
        const bulkPearlRingUsers = pearlringusers.map(({ user, pooldetail }) => ({
            updateOne: {
                filter: { owner: new mongoose.Types.ObjectId(user._id) },
                update: [
                    {
                        $set: {
                            amount: {
                                $min: [
                                    { $add: [{ $ifNull: ["$amount", 0] }, 5] },
                                    getmaxenergy(pooldetail.subscription) + 5
                                ]
                            }
                        }
                    }
                ]
            }
        }))

        if (bulkPearlRingUsers.length > 0){
            await energycollection.bulkWrite(bulkPearlRingUsers)
        }

        //  THIS IS FOR RUBY
        const rubyringenergypipeline = [
            {
                $match: {
                    name: "Ruby",
                    type: "ring",
                    isequip: "1"
                }
            },
            {
                $lookup: {
                    from: 'gameusers',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    from: 'pooldetails',
                    localField: 'owner',
                    foreignField: 'owner',
                    as: 'pooldetail'
                }
            },
            {
                $unwind: '$pooldetail'
            },
            {
                $project: {
                    _id: 0,
                    'user._id': 1,
                    'user.username': 1,
                    'pooldetail.subscription': 1
                }
            }
        ]

        const rubyringcursor = await cosmeticcollection.aggregate(rubyringenergypipeline)

        const rubyringusers = await rubyringcursor.toArray()

        const bulkRubyRingUsers = rubyringusers.map(({ user, pooldetail }) => ({
            updateOne: {
                filter: { owner: new mongoose.Types.ObjectId(user._id) },
                update: [
                    {
                        $set: {
                            amount: {
                                $min: [
                                    { $add: [{ $ifNull: ["$amount", 0] }, 10] },
                                    getmaxenergy(pooldetail.subscription) + 10
                                ]
                            }
                        }
                    }
                ]
            }
        }))

        if (bulkRubyRingUsers.length > 0){
            await energycollection.bulkWrite(bulkRubyRingUsers)
        }

        //  THIS IS FOR EMERALD
        const emeraldringenergypipeline = [
            {
                $match: {
                    name: "Emerald",
                    type: "ring",
                    isequip: "1"
                }
            },
            {
                $lookup: {
                    from: 'gameusers',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    from: 'pooldetails',
                    localField: 'owner',
                    foreignField: 'owner',
                    as: 'pooldetail'
                }
            },
            {
                $unwind: '$pooldetail'
            },
            {
                $project: {
                    _id: 0,
                    'user._id': 1,
                    'user.username': 1,
                    'pooldetail.subscription': 1
                }
            }
        ]

        const emeraldringenergypipelineringcursor = await cosmeticcollection.aggregate(emeraldringenergypipeline)

        const emeraldringusers = await emeraldringenergypipelineringcursor.toArray()

        const bulkEmeraldRingUsers = emeraldringusers.map(({ user, pooldetail }) => ({
            updateOne: {
                filter: { owner: new mongoose.Types.ObjectId(user._id) },
                update: [
                    {
                        $set: {
                            amount: {
                                $min: [
                                    { $add: [{ $ifNull: ["$amount", 0] }, 20] },
                                    getmaxenergy(pooldetail.subscription) + 20
                                ]
                            }
                        }
                    }
                ]
            }
        }))

        if (bulkEmeraldRingUsers.length > 0){
            await energycollection.bulkWrite(bulkEmeraldRingUsers)
        }

        //  THIS IS FOR DIAMOND
        const diamondringenergypipeline = [
            {
                $match: {
                    name: "Diamond",
                    type: "ring",
                    isequip: "1"
                }
            },
            {
                $lookup: {
                    from: 'gameusers',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    from: 'pooldetails',
                    localField: 'owner',
                    foreignField: 'owner',
                    as: 'pooldetail'
                }
            },
            {
                $unwind: '$pooldetail'
            },
            {
                $project: {
                    _id: 0,
                    'user._id': 1,
                    'user.username': 1,
                    'pooldetail.subscription': 1
                }
            }
        ]

        const diamondringenergypipelineringcursor = await cosmeticcollection.aggregate(diamondringenergypipeline)

        const diamondringusers = await diamondringenergypipelineringcursor.toArray()

        const bulkDiamondRingUsers = diamondringusers.map(({ user, pooldetail }) => ({
            updateOne: {
                filter: { owner: new mongoose.Types.ObjectId(user._id) },
                update: [
                    {
                        $set: {
                            amount: {
                                $min: [
                                    { $add: [{ $ifNull: ["$amount", 0] }, 40] },
                                    getmaxenergy(pooldetail.subscription) + 30
                                ]
                            }
                        }
                    }
                ]
            }
        }))

        if (bulkDiamondRingUsers.length > 0){
            await energycollection.bulkWrite(bulkDiamondRingUsers)
        }

        parentPort.postMessage({message: "success", data: "Granting Energy to Ring Users Complete"})
        await closedatabase()
        return
    }
    catch (error) {
        console.error('Error during MongoDB operations:', error);
        parentPort.postMessage({message: "failed", data: error})
        await closedatabase();
        return
    }
})