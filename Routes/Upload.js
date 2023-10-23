const express = require("express");
const router = express.Router();
const Upload = require('../Controllers/Upload');
const upload = require("../Middleware/uploadimg")

const uploadimg = upload.single("file")

router.post('/uploadimg', function (req, res, next){
    uploadimg(req, res, function(err) {
        if (err){
            return res.status(400).send({ message: "failed", data: err.message })
        }

        next()
    })
}, Upload.tempupload)

router.post("/deletetemp", Upload.deletetemp)

module.exports = router