const jwt = require("jsonwebtoken"),
User = require("../Models/Users");

exports.protect = (req, res, next) => {
  let token = req.headers.authorization;
  let headerpart = token.split(' ')[1]
  if(!token){
      res.status(401).json("You are not authorized")
  } else {
      if (token.startsWith("Bearer")){
          // decode dito
          jwt.verify(
              token.split(' ')[1],
              process.env.JWT_SECRET_KEY,
              async (err, response) => {
                  if (err && err.name){
                      res.status(401).json({expired: "Your token is expired, you are not authorized"})
                  } else {
                      req.user = await User.findById(response.id)
                      if(req.user.token === headerpart){
                          next()
                      } else {
                          res
                          .status(401)
                          .json({expired: "Not authorized, invalid token"})
                      }
                  }
              }
          );
      } else {
          res.status(401).json({error: "Not authorized, invalid token"})
      }
  }
}

exports.gameprotect = (req, res, next) => {
  const token = req.headers.authorization;
 
  if(!token){
    res.status(401).json({message: "Not authorized, fake token"});
  } else {
    if(token.startsWith("Bearer")){
      jwt.verify(
        token.split(" ")[1],
        process.env.JWT_SECRET,
        async (err, response) => {
          if (err && err.name) {
            res.status(401).json({message: "Not authorized, fake token",});
          } else {
            
            if (response.message === "cbspayaman") {
              next();
            } else {
              res.status(401).json({message: "Not authorized, fake token",});
            }
          }
        }
      );
    } else {
      res.status(401).json({message: "Not authorized, fake token"});
    }
  }
}