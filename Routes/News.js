const express =  require("express")
const router = express.Router();
const News = require("../Controllers/News");
const { protect } = require("../Middleware/index");


// [without params]
router.post("/addnews", protect, News.addNews)
router.get("/find", News.getAll)

// [with params]
router.put("/:id/update" ,protect, News.update)
router.get("/:id/find", News.getOne)
router.delete("/:id/destroy", protect, News.destroy);







module.exports = router;