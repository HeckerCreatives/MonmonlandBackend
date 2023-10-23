const express = require("express");
const router = express.Router();
const UpgradeSubscription = require("../Controllers/UpgradeSubscription")
const upload = require("../Middleware/receiptupload")

const receiptimg = upload.single("file")

router.post("/add", UpgradeSubscription.add)
router.post("/addbuyer", UpgradeSubscription.addbuyer)
router.get("/find", UpgradeSubscription.getAll)
router.get("/findbuyer", UpgradeSubscription.getAllbuyer)
router.get('/findone/:id', UpgradeSubscription.getOneUser)
router.put("/update/:id", UpgradeSubscription.update)

router.put("/updatebuyer/:id", function (req, res, next){
    receiptimg(req, res, function(err) {
        if (err){
            return res.status(400).send({ message: "failed", data: err.message })
        }

        next()
    })
}, UpgradeSubscription.updatebuyer)

router.delete("/:id/destroy", UpgradeSubscription.destroy);
router.delete("/:id/destroybuyer", UpgradeSubscription.destroybuyer);
router.delete("/destroymultiple", UpgradeSubscription.destroymultiple);
router.post('/filterpayment', UpgradeSubscription.paymentfilter);
router.post('/searchcashier', UpgradeSubscription.searchcashier);
router.post('/autoreceipt', UpgradeSubscription.findcoinbasereceipt);
router.post("/iscashier", UpgradeSubscription.iscashier)
router.get("/adminfee", UpgradeSubscription.findadminfee)


module.exports = router;