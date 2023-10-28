const express = require("express");
const router = express.Router();
const SubsAccumulated = require("../Controllers/SubsAccumulated");
const { protect , gameprotect} = require("../Middleware/index")

router.post("/create", SubsAccumulated.create)
router.post("/update", gameprotect, SubsAccumulated.update )
router.post("/find", SubsAccumulated.find)
router.get("/totalincome", gameprotect ,SubsAccumulated.findtotal)



module.exports = router;