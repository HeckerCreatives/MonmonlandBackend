const express = require("express");
const router = express.Router();
const SubsAccumulated = require("../Controllers/SubsAccumulated");

router.post("/create", SubsAccumulated.create)
router.post("/update", SubsAccumulated.update )
router.post("/find", SubsAccumulated.find)



module.exports = router;