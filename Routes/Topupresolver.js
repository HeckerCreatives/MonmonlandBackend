const express = require("express");
const router = express.Router();
const Topupresolver = require("../Controllers/Topupresolver");
const upload = require("../Middleware/receiptupload")
const { protect } = require("../Middleware/index")
const receiptimg = upload.single("file")

router.post("/search", protect, Topupresolver.search)
router.post("/resolve", protect, function (req, res, next){
    receiptimg(req, res, function(err) {
        if (err){
            return res.status(400).send({ message: "failed", data: err.message })
        }

        next()
    })
}, Topupresolver.resolve)

router.post("/find", protect ,Topupresolver.find)

module.exports = router;