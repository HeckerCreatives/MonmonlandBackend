const express= require("express");
const router = express.Router();
const Roadmap = require("../Controllers/Roadmap");

// [without params]
router.post("/addroadmap", Roadmap.addRoadmap)
router.get("/find", Roadmap.getOne)

// [with params]
router.put("/:id/update", Roadmap.update)











module.exports = router;