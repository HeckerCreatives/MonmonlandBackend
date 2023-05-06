const express =  require("express")
const router = express.Router();
const News = require("../Controllers/News");


// [without params]
router.post("/addnews", News.addNews)
router.get("/find", News.getAll)

// [with params]
router.put("/:id/update", News.update)
router.get("/:id/find", News.getOne)








module.exports = router;