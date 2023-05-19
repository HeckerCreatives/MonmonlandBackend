const User = require('../Models/Users')
const bcrypt = require('bcrypt')
const Roles = require('../Models/Roles')
module.exports.userRegister = async (request, response) => {
    const {firstName,lastName,userName,email,password, roleId, referrerId} = request.body

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
                password: bcrypt.hashSync(password, 10)
            })
            // Save new user
            newUser.save()
            .then(save => {
            return response.send(save)
            })
            
            }
        })
        
    }
    catch (error){
        return response.send(error)
    }
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
    User.findByIdAndUpdate(request.params.id, request.body, {new: true})
    .then(data => response.json(data))
    .catch(error => response.status(400).json({error: error.message}))
}
  
module.exports.getOneUser = (request, response) => {
    User.findById(request.params.id)
    .select("-password")
    .populate({
        path: "roleId",
        select: "display_name"
    })
    .then(data => response.json(data.banned ? "User is banned" : data))
    .catch(error => response.send(error))
}  
  
module.exports.getAll = (request, response) => {
    User.find()
    .then(data =>{
    response.send(data)
    })
    .catch(error => response.send(error))
}