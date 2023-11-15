const express =  require("express")
const router = express.Router();
const News = require("../Controllers/News");
const { protect } = require("../Middleware/index");
const upload = require("../Middleware/etcupload")
const etcimg = upload.single("file")

// [without params]
router.post("/addnews", protect, function (req, res, next){
    etcimg(req, res, function(err) {
        if (err){
            return res.status(400).send({ message: "failed", data: err.message })
        }

        next()
    })
}, News.addNews)
router.get("/find", News.getAll)

// [with params]
router.put("/:id/update" ,protect, function (req, res, next){
    etcimg(req, res, function(err) {
        if (err){
            return res.status(400).send({ message: "failed", data: err.message })
        }

        next()
    })
}, News.update)

router.get("/:id/find", News.getOne)
router.delete("/:id/destroy", protect, News.destroy);







module.exports = router;