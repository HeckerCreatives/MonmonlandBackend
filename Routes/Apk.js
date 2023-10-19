const express = require("express");
const router = express.Router();
const Apk = require('../Controllers/Apk');
const upload = require("../Middleware/upload")

const uploadapk = upload.single("file")

router.post('/upload', function (req, res, next){
    uploadapk(req, res, function(err) {
        if (err){
            return res.status(400).send({ message: "failed", data: err.message })
        }

        next()
    })
}, Apk.create)


module.exports = router