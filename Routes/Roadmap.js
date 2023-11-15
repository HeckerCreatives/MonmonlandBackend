const express= require("express");
const router = express.Router();
const Roadmap = require("../Controllers/Roadmap");
const { protect } = require("../Middleware/index")
const upload = require("../Middleware/etcupload")
const etcimg = upload.single("file")

// [without params]
router.post("/addroadmap", protect, Roadmap.addRoadmap)
router.get("/find", Roadmap.getAll)

// [with params]
router.put("/:id/update", protect, function (req, res, next){
    etcimg(req, res, function(err) {
        if (err){
            return res.status(400).send({ message: "failed", data: err.message })
        }
        next()
    })
}, Roadmap.update)
router.get("/:id/find", Roadmap.getOne)










module.exports = router;