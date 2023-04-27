const express =  require("express")
const router = express.Router();
const News = require("../Controllers/News");


// [without params]
router.post("/addnews", News.addNews)
router.get("/find", News.getOne)

// [with params]
router.put("/:id/update", News.update)









module.exports = router;