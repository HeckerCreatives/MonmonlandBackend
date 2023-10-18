const User = require('../Models/Users')
const bcrypt = require('bcrypt')
const Roles = require('../Models/Roles')
const TopUpWallet = require("../Models/Topupwallet")
const PayoutWallet = require("../Models/PayoutWallet")
var playfab = require('playfab-sdk')
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
PlayFab.settings.titleId = process.env.monmontitleid;
// const secretKey = process.env.crypto_secret;

function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';

  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
}

module.exports.userRegister = async (request, response) => {
    const {firstName,lastName,userName,email,password, roleId, referrerId, phone} = request.body

    const playFabUserData = {
      CreateAccount: true,            
      CustomId: generateRandomString(16),           
    };

    PlayFabClient.LoginWithCustomID(playFabUserData, async (error, result) =>{
        if(result){
          try{
            await User.findOne({email: email})
            .then(result => {
                if(result !== null){
                    response.send(false)
                } else {
                // Create user
                const newUser = new User({
                    roleId: roleId,
                    referrerId: referrerId,
                    firstName: firstName,
                    lastName: lastName,
                    userName: userName,
                    email:email,
                    phone: phone,
                    password: password,
                    playfabid: playFabUserData.CustomId
                })
                
                // Save new user
                newUser.save()
                .then(save => {
                  
                  const topupwallet = {
                    amount: 0,
                    name: "manual",
                    user: save._id
                  }
    
                  TopUpWallet.create(topupwallet)
    
                  const payoutwalletprocess = [
                    {
                    amount: 0,
                    name: "process",
                    user: save._id
                    },
                    {
                      amount: 0,
                      name: "done",
                      user: save._id
                    },
                  ]
    
                  PayoutWallet.create(payoutwalletprocess)
    
                 
    
                 response.send(save)
                })
                
                }
            })
            
          }
            catch (error){
                return response.send(error)
          }
        } else if (error) {
            return response.send(error)
        }
    })

    
}

module.exports.referral = (request, response) => {
    User.find()
    .byRefferal(request.params.userId)
    .select("-password")
    .populate({
        path:"roleId",
        select:"display_name"
    })
    .then(users => response.json(users.filter(user => !user.banned)))
    .catch(error => response.status(400).json({error: error.message}));
}


module.exports.getParentReferrer = (request, response) =>
  User.findById(request.params.id)
    .select("-password")
    .populate({
      path: "roleId",
      select: "display_name",
    })
    .populate({
        path : 'referrerId',
        select: "roleId referrerId userName",
          populate:
          [
            {
                path: 'referrerId',
                select: "roleId referrerId userName",
                model: User,
                  populate:
                   [
                      {
                        path: 'referrerId',
                        select: "roleId referrerId userName",
                        model: User,
                          populate: {
                              path: "roleId",
                              select: "display_name",
                          }
                      }, 
                      {
                        path: 'roleId',
                        select: "display_name",
                        model: Roles
                      }
                   ]
            },
            {
                path: 'roleId',
                select: "display_name",
                model: Roles
            }
        ],
    })
    .then(user => {
        let data = {};
        switch (user.roleId.display_name) {
          case "Agent":
              data = {
                  "Agent": user?.userName,
                  "Administrator": user?.referrerId?.userName,
                }
              break;
            default:
            data = {
                "Agent": "none",
                "Administrator": user?.userName,
            }
        }

        response.json(data)
    })
.catch(error => res.status(400).json({ error: error.message }));

module.exports.update = (request, response) => {
    const { password, ...data } = request.body;
  
    if (password) {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          response.status(500).json({ error: err.message });
          return;
        }
  
        const updatedData = { ...data, password: hashedPassword };
  
        User.findByIdAndUpdate(request.params.id, updatedData, { new: true })
          .then((data) => response.json(data))
          .catch((error) => response.status(400).json({ error: error.message }));
      });
    } else {
      User.findByIdAndUpdate(request.params.id, data, { new: true })
        .then((data) => response.json(data))
        .catch((error) => response.status(400).json({ error: error.message }));
    }
  };
  
  
module.exports.getOneUser = (request, response) => {
    User.findById(request.params.id)
    .select("-password")
    .populate({
        path: "roleId",
        select: "display_name"
    })
    .populate({
      path: "subscriptionId",
      select: "subscriptionName"
    })
    .then(data => response.json(data.banned ? "User is banned" : data))
    .catch(error => response.send(error))
}  
  
module.exports.getAll = (request, response) => {
    User.find()
    .populate({
        path: "roleId",
        select: "display_name"
    })
    .populate({
      path: "subscriptionId",
      select: "subscriptionName"
    })
    .then(data =>{
    response.send(data.banned ? "User is banned" : data)
    })
    .catch(error => response.send(error))
}

exports.destroy = (request, response) => {
    User.findByIdAndUpdate(request.params.id, {
        banned: true,
    })
    .then(() => response.json(request.params.id))
    .catch(error => response.status(400).json({ error: error.message }));
}

exports.destroymultiple = (request, response) => {
    const { ids } = request.body;
  
    User.updateMany(
      { _id: { $in: ids } },
      { banned: true }
    )
      .then(() => response.json(ids))
      .catch((error) => response.status(400).json({ error: error.message }));
  };
  
  