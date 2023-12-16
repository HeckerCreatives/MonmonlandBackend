const express = require("express");
const router = express.Router();
const Auth = require('../Controllers/Auth');
const { protect } = require('../Middleware/index')
router.post('/login', Auth.Login)
router.post("/gentoken", Auth.gentoken)
router.get('/islogin', protect, Auth.islogin)
router.get('/logout', Auth.logout)
module.exports = router