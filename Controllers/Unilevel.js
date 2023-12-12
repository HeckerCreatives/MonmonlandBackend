const Unilevel = require("../Models/Unilevel")

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

    const aggregationPipeline = [
      { 
          $match: { username: "jim0"} 
      },
      {
          $graphLookup: {
              from: 'unilevels',
              startWith: '$_id',
              connectFromField: '_id',
              connectToField: 'referrer',
              maxDepth: 5,
              as: 'downline',
          },
      },
      {
          $addFields: {
              level: {
                  $max: {
                      $map: {
                          input: '$downline',
                          as: 'd',
                          in: '$$d.level',
                      },
                  },
              },
          },
      },
      {
          $group: {
              _id: '$level',
              downline: { $push: '$downline' },
          },
      },
      {
          $sort: { _id: 1 },
      },
  ];
  
  const result = await Unilevel.aggregate(aggregationPipeline).then(data => data);
  return res.json(result)
}

exports.create = (req, res) => {
    const a = {
        username ,
        referrer
    } = req.body

    Unilevel.create(a)
}