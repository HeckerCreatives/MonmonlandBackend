const express = require("express");
const router = express.Router();
const User = require('../Controllers/Users')

router.post('/register', User.userRegister)
router.get('/find', User.getAll)
router.put('update', User.update)

module.exports = router;