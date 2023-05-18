const express = require("express");
const router = express.Router();
const User = require('../Controllers/Users')

router.post('/register', User.userRegister)
router.get('/find', User.getAll)
router.get('/find/:id', User.getOne)
router.put('update', User.update)
router.get('/getparentrefferrer/:id', User.getParentReferrer)
router.get('/referral/:userId', User.referral)

module.exports = router;