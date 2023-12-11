const Unilevel = require("../Models/Unilevel")

exports.find = async  (req,res) => {
    // const db = Unilevel;
    const aggregationpipline = [
        { 
            $match: { username: "jim0"} 
        },
        {
            $graphLookup: {
              from: 'unilevels',
              startWith: '$username',
              connectFromField: 'username',
              connectToField: 'referrer',
              maxDepth: 5,
              as: 'downline',
            },
        },
        {
            $project: {
              _id: 0,
              name: 1,
              downline: {
                $map: {
                  input: '$downline',
                  as: 'player',
                  in: { username: '$$player.username', referrer: '$$player.referrer' },
                },
              },
            },
        },
    ]

  const result = await Unilevel.aggregate(aggregationpipline).then(data => data);
  return res.json(result)
}

exports.create = (req, res) => {
    const a = {
        username ,
        referrer
    } = req.body

    Unilevel.create(a)
}