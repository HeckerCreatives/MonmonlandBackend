const express = require("express");
const router = express.Router();
const Auth = require('../Controllers/Auth');

router.post('/login', Auth.Login)
router.post("/gentoken", Auth.gentoken)

module.exports = router