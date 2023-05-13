const express = require("express");
const router = express.Router();
const Auth = require('../Controllers/Auth');

router.get('/login', Auth.Login)


module.exports = router