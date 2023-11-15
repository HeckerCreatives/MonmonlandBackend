const express = require("express");
const router = express.Router();
const Games = require("../Controllers/Games");
const { protect } = require("../Middleware/index")
const upload = require("../Middleware/etcupload")
const etcimg = upload.single("file")

router.post("/addgame", protect, function (req, res, next){
    etcimg(req, res, function(err) {
        if (err){
            return res.status(400).send({ message: "failed", data: err.message })
        }

        next()
    })
}, Games.create)

router.get("/find", Games.findall)

router.put("/:id/update", protect, function (req, res, next){
    etcimg(req, res, function(err) {
        if (err){
            return res.status(400).send({ message: "failed", data: err.message })
        }

        next()
    })
}, Games.update)

router.get("/:id/findone", Games.find)
router.delete("/:id/destroy", protect, Games.destroy);









module.exports = router;