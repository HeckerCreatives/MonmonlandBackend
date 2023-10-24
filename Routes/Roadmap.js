const express= require("express");
const router = express.Router();
const Roadmap = require("../Controllers/Roadmap");
const { protect } = require("../Middleware/index")
// [without params]
router.post("/addroadmap", protect, Roadmap.addRoadmap)
router.get("/find", Roadmap.getAll)

// [with params]
router.put("/:id/update", protect, Roadmap.update)
router.get("/:id/find", Roadmap.getOne)










module.exports = router;