const jwt = require("jsonwebtoken"),
User = require("../Models/Users");
const fs = require('fs')
const path = require('path')
const publicKey = fs.readFileSync(path.resolve(__dirname, "../public-key.pem"), 'utf-8');
const jsonwebtokenPromisified = require('jsonwebtoken-promisified')

const verifyJWT = async (token) => {
  try {
      const decoded = await jsonwebtokenPromisified.verify(token, publicKey, { algorithms: ['RS256'] });
      return decoded;
  } catch (error) {
      console.error('Invalid token:', error.message);
      throw new Error('Invalid token');
  }
};

exports.protect = async (req, res, next) => {

  let token = req.headers.cookie?.split('; ').find(row => row.startsWith('sessionToken=')).split('=')[1]

  if(!token){
      res.status(401).json("You are not authorized")
  } else {
    try {
      const decodeToken = await verifyJWT(token)
      req.user = decodeToken
      next()
    } catch (error) {
      return res.status(401).json({message: "Unauthorized", data : error})
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

// if (token.startsWith("Bearer")){
      //     // decode dito
      //     jwt.verify(
      //         token.split(" ")[1],
      //         process.env.JWT_SECRET,
      //         async (err, response) => {
      //             if (err && err.name){
      //                 res.status(401).json({expired: "Your token is expired, you are not authorized"})
      //             } else {
      //                 req.user = await User.findById(response.id)
      //                 if(req.user.token === headerpart){
      //                     next()
      //                 } else {
      //                     res
      //                     .status(401)
      //                     .json({expired: "Not authorized, invalid token"})
      //                 }
      //             }
      //         }
      //     );
      // } else {
      //     res.status(401).json({error: "Not authorized, invalid token"})
      // }