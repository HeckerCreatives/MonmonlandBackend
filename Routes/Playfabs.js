const express =  require("express")
const router = express.Router();
const Playfabs = require("../Controllers/Playfabs");
// const { protect, gameprotect } = require("../Middleware/index");


router.post("/register", Playfabs.registration)



module.exports = router;