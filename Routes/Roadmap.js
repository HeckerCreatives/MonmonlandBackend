const express= require("express");
const router = express.Router();
const Roadmap = require("../Controllers/Roadmap");

// [without params]
router.post("/addroadmap", Roadmap.addRoadmap)
router.get("/find", Roadmap.getAll)

// [with params]
router.put("/:id/update", Roadmap.update)
router.get("/:id/find", Roadmap.getOne)










module.exports = router;