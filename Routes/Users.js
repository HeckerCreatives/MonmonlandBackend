const express = require("express");
const router = express.Router();
const User = require('../Controllers/Users')

router.post('/register', User.userRegister)
router.get('/find', User.getAll)
router.put('/update/:id', User.update)
router.get('/findone/:id', User.getOneUser)
router.get('/getparentrefferrer/:id', User.getParentReferrer)
router.get('/referral/:userId', User.referral)
router.delete("/:id/destroy", User.destroy);
router.delete("/destroymultiple", User.destroymultiple);

module.exports = router;