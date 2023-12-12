const Unilevel = require("../Models/Unilevel")
const mongoose = require("mongoose");
exports.find = async  (req,res) => {
    // const db = Unilevel;
    // const aggregationPipeline = [
    //     { 
    //         $match: { username: "jim0"} 
    //     },
    //     {
    //         $graphLookup: {
    //           from: 'unilevels',
    //           startWith: '$_id',
    //           connectFromField: '_id',
    //           connectToField: 'referrer',
    //           maxDepth: 5,
    //           as: 'downline',
    //         },
    //     },
    //     {
    //         $project: {
    //           _id: 0,
    //           name: 1,
    //           downline: {
    //             $map: {
    //               input: '$downline',
    //               as: 'player',
    //               in: { username: '$$player.username', referrer: '$$player.referrer' },
    //             },
    //           },
    //         },
    //     },
    // ]
    const playerId = '65771798e2e22519aa78d4c1'
    const downline = await Unilevel.aggregate([
      {
          $match: {
              _id: new mongoose.Types.ObjectId(playerId),
          },
      },
      {
          $graphLookup: {
              from: "unilevels",
              startWith: "$_id",
              connectFromField: "_id",
              connectToField: "referrer",
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
  ]);

  // const result = await Unilevel.aggregate(aggregationPipeline).then(data => data);
  return res.json(downline)
}

exports.create = (req, res) => {
    const a = {
        username ,
        referrer
    } = req.body

    Unilevel.create(a)
}