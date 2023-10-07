const express = require("express");
const router = express.Router();
const Merchandise = require("../Controllers/Merchandise");

router.post("/create", Merchandise.create)
router.post("/update", Merchandise.update )
router.post("/find", Merchandise.find)



module.exports = router;