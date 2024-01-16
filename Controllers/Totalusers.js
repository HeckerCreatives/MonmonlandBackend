const Totalusers = require("../Models/Totalusers")
const Pooldetails = require("../Gamemodels/Pooldetails")
exports.update = (req, res) => {
    Totalusers.findByIdAndUpdate(process.env.totaluser, {$inc: {count: 1}})
    .then(() => {
        res.json({message: "success"})
    })
    .catch(error => response.status(400).json({ error: error.message }));
}

exports.find = (req, res) => {
    Totalusers.findOne({})
    .then(data => {
        res.json({message: "success", data: data})
    })
    .catch(error => response.status(400).json({ error: error.message }));
}

exports.subscriptionusers = (req, res) => {

    Pooldetails.aggregate([
        {
            $group: {
                _id: "$subscription", // Grouping by subscription
                count: { $sum: 1 } // Counting documents for each subscription
            }
        },
        {
            $group: {
                _id: null,
                subscriptions: {
                    $push: {
                        k: "$_id",
                        v: { count: "$count" }
                    }
                },
                totalCount: { $sum: "$count" } // Calculate the total count
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $arrayToObject: {
                        $concatArrays: [
                            "$subscriptions",
                            [{ k: "total", v: { count: "$totalCount" } }]
                        ]
                    }
                }
            }
        }
    ])
    .then(data => {
        res.json({message: "success", data: data[0]}); // Assuming there's only one result
    })
    .catch(error => res.status(400).json({ error: error.message }));

}