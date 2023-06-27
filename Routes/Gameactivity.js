const express = require("express");
const router = express.Router();
const Gameactivity = require("../Controllers/Gameactivity");


// [without params]
router.post("/addprogressbar", Gameactivity.Progressbar);
router.get("/find", Gameactivity.getall)
router.get("/history", Gameactivity.gethistory)

// [with params]
router.put("/:id/update", Gameactivity.update)
router.get("/:id/find", Gameactivity.getOne)




module.exports = router;