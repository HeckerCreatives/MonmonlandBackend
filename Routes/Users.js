const express = require("express");
const router = express.Router();
const User = require('../Controllers/Users')
const { protect } = require("../Middleware/index")
router.post('/register', protect, User.userRegister)
router.get('/find', User.getAll)
router.put('/update/:id', protect, User.update)
router.get('/findone/:id', protect, User.getOneUser)
router.get('/getparentrefferrer/:id', User.getParentReferrer)
router.get('/referral/:userId', User.referral)
router.delete("/:id/destroy", protect, User.destroy);
router.delete("/destroymultiple", protect, User.destroymultiple);

module.exports = router;