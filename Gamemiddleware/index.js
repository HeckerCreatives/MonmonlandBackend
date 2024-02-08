const Gameusers = require("../Gamemodels/Gameusers")
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

exports.protectplayer = async (req, res, next) => {
    // let token = req.headers.cookie?.split('; ').find(row => row.startsWith('sessionToken=')).split('=')[1]
    let token = req.cookies.sessionToken
    if(!token){
        res.status(401).json({message: "Unathorized"})
    } else {

    try {
        const decodeToken = await verifyJWT(token)
        const userdata = await Gameusers.findOne({_id: decodeToken.id })
        .select('-password')
        .then(data => data)
        .catch(err => res.status(401).json({message: "Unathorized"}))
        
        if(decodeToken.token != userdata.webtoken){
            return res.status(401).json({message: "duallogin"})
        }

        if(decodeToken.status != "active" && decodeToken.status != "expired" || userdata.status != "active" && userdata.status != "expired"){
            return res.status(401).json({message: "banned"})
        }

        req.user = decodeToken
        next()
    } 
      
    catch (error) {
        return res.status(401).json({message: "Unauthorized", data : error})
    }
        
    }
    
}