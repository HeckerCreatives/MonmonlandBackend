const express = require("express");
const router = express.Router();
const UpgradeSubscription = require("../Controllers/UpgradeSubscription")
const upload = require("../Middleware/receiptupload")
const { protect } = require("../Middleware/index")
const receiptimg = upload.single("file")

router.post("/add", protect, UpgradeSubscription.add)
router.post("/addbuyer", UpgradeSubscription.addbuyer)
router.get("/find", UpgradeSubscription.getAll)
router.get("/findbuyer", protect, UpgradeSubscription.getAllbuyer)
router.get('/findone/:id', UpgradeSubscription.getOneUser)
router.put("/update/:id", protect, UpgradeSubscription.update)

router.put("/updatebuyer/:id", protect, function (req, res, next){
    receiptimg(req, res, function(err) {
        if (err){
            return res.status(400).send({ message: "failed", data: err.message })
        }

        next()
    })
}, UpgradeSubscription.updatebuyer)


router.delete("/destroymultiple", protect, UpgradeSubscription.destroymultiple);
router.post('/filterpayment', UpgradeSubscription.paymentfilter);
router.post('/searchcashier', UpgradeSubscription.searchcashier);
router.post('/autoreceipt', protect, UpgradeSubscription.findcoinbasereceipt);
router.post("/iscashier", protect, UpgradeSubscription.iscashier)
router.get("/adminfee", protect, UpgradeSubscription.findadminfee)
router.delete("/:id/destroy", protect, UpgradeSubscription.destroy);
router.delete("/:id/destroybuyer", protect, UpgradeSubscription.destroybuyer);

module.exports = router;