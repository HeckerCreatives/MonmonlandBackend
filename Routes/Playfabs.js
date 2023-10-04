const express =  require("express")
const router = express.Router();
const Playfabs = require("../Controllers/Playfabs");
const { protect, gameprotect } = require("../Middleware");


router.post("/register" , Playfabs.registration)



module.exports = router;