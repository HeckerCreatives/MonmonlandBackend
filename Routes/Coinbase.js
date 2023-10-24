const express = require("express");
const router = express.Router();
var coinbase = require('coinbase-commerce-node');
var Client = coinbase.Client;
var Charge = coinbase.resources.Charge;
Client.init(process.env.coinbase);
require('dotenv').config();
const Coin = require("../Coinbase/index")
const Subscription = require("../Models/Subscription")
const AutoReceipt = require("../Models/Receiptautomated")
const crypto = require('crypto');
const secretKey = process.env.crypto_secret;
const { protect } = require("../Middleware/index")

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
  
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
  }
// Encryption function
function encryptString(text, key) {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

router.post("/funds", async (req, res) => {
  const name = req.body.name;
  const playfabId = req.body.playfabId;
  const playfabToken = req.body.playfabToken
  const {amount} = req.body;
  let randomid = generateRandomString();
  const encryptxt = encryptString(randomid, secretKey);
  let logo;
  
  if(amount === 20){
    logo = "https://res.cloudinary.com/dykvp9i3v/image/upload/v1697733307/20_t5tqcy.png"
  } else if(amount === 50){
    logo = "https://res.cloudinary.com/dykvp9i3v/image/upload/v1697733307/50_wo8mpy.png"
  } else if (amount === 100){
    logo = "https://res.cloudinary.com/dykvp9i3v/image/upload/v1697733308/100_cmpd73.png"
  } else if (amount === 200){
    logo = "https://res.cloudinary.com/dykvp9i3v/image/upload/v1697733308/200_ziswjx.png"
  }
  
  let data = new Charge({
      "name": `$${amount} Top up`,
      "description": "Top Up",
      "pricing_type": "fixed_price",
      "local_price": {
        "amount": amount,
        "currency": "USD"
      },
      "metadata": {
        "customer_id": playfabId,
        "customer_name": name,
        "receiptId": randomid,
      },
      "redirect_url": `${process.env.API_URL}coin/success?id=${encryptxt}`,
      "cancel_url": `${process.env.API_URL}coin/cancel?id=${encryptxt}`,
      "logo_url": logo
    });
    
    
    data.save(function (error, response) {
      AutoReceipt.create({
        receiptId: response.metadata.receiptId,
        orderCode: response.code,
        username: response.metadata.customer_name,
        playerPlayfabId: response.metadata.customer_id,
        subscriptionType: `Top Up ${amount}`,
        amount: response.pricing.local.amount,
        playfabToken: playfabToken
      })

      if (response && response.id) {
          Charge.retrieve(response.id, function (error, response) {
              res.json(response);
          });
      }
  });
    
})

router.post("/bundles", async (req, res) => {
  const name = req.body.name;
  const playfabId = req.body.playfabId;
  const playfabToken = req.body.playfabToken
  const { amount, bundle, bundledescription, subs } = req.body;
  let randomid = generateRandomString();
  let logo;
  const encryptxt = encryptString(randomid, secretKey);
  
  if(subs === "ironpack"){
    logo = "https://res.cloudinary.com/dykvp9i3v/image/upload/v1697733307/30_qerm0z.png"
  } else if (subs === "steelpack"){
    logo = "https://res.cloudinary.com/dykvp9i3v/image/upload/v1697733307/65_iqxwuk.png"
  } else if (subs === "mithrilpack"){
    logo = "https://res.cloudinary.com/dykvp9i3v/image/upload/v1697733308/120_zjjydy.png"
  } else if (subs === "adamantpack"){
    logo = "https://res.cloudinary.com/dykvp9i3v/image/upload/v1697733307/180_ku6vle.png"
  }
  
  let data = new Charge({
      "name": bundle,
      "description": bundledescription,
      "pricing_type": "fixed_price",
      "local_price": {
        "amount": amount,
        "currency": "USD"
      },
      "metadata": {
        "customer_id": playfabId,
        "customer_name": name,
        "receiptId": randomid,
      },
      "redirect_url": `${process.env.API_URL}coin/success?id=${encryptxt}`,
      "cancel_url": `${process.env.API_URL}coin/cancel?id=${encryptxt}`,
      "logo_url": logo,
    });
    
    
    data.save(function (error, response) {
      AutoReceipt.create({
        receiptId: response.metadata.receiptId,
        orderCode: response.code,
        username: response.metadata.customer_name,
        playerPlayfabId: response.metadata.customer_id,
        subscriptionType: bundle,
        amount: response.pricing.local.amount,
        playfabToken: playfabToken
      })

      if (response && response.id) {
          Charge.retrieve(response.id, function (error, response) {
              res.json(response);
          });
      }
  });
    
})

router.post("/ruby", async (req, res) => {
    const name = req.body.name;
    const playfabId = req.body.playfabId;
    // const quantity = req.body.quantity;
    const playfabToken = req.body.playfabToken
    let amount;
    let randomid = generateRandomString();
    const encryptxt = encryptString(randomid, secretKey);
    
    await Subscription.findOne({subscriptionName: "Ruby"})
    .then(data => {
        amount = data.amount;
    })
    
    let data = new Charge({
        "name": "Ruby",
        "description": "Ruby Subscription",
        "pricing_type": "fixed_price",
        "local_price": {
          "amount": amount,
          "currency": "USD"
        },
        "metadata": {
          "customer_id": playfabId,
          "customer_name": name,
          "receiptId": randomid,
        },
        "redirect_url": `${process.env.API_URL}coin/success?id=${encryptxt}`,
        "cancel_url": `${process.env.API_URL}coin/cancel?id=${encryptxt}`,
        "logo_url": "https://res.cloudinary.com/commerce/image/upload/v1694414488/kriawk9fv7yvdayongng.png"
      });
      
      
      data.save(function (error, response) {
        AutoReceipt.create({
          receiptId: response.metadata.receiptId,
          orderCode: response.code,
          username: response.metadata.customer_name,
          playerPlayfabId: response.metadata.customer_id,
          subscriptionType: "ruby",
          amount: response.pricing.local.amount,
          playfabToken: playfabToken
        })

        if (response && response.id) {
            Charge.retrieve(response.id, function (error, response) {
                res.json(response);
            });
        }
    });
      
})


router.post("/emerald", async (req, res) => {
  const name = req.body.name;
  const playfabId = req.body.playfabId;
  // const quantity = req.body.quantity;
  const playfabToken = req.body.playfabToken
  let amount;
  let randomid = generateRandomString();
  const encryptxt = encryptString(randomid, secretKey)
  
  await Subscription.findOne({subscriptionName: "Emerald"})
  .then(data => {
      amount = data.amount;
  })
  
  let data = new Charge({
      "name": "Emerald",
      "description": "Emerald Subscription",
      "pricing_type": "fixed_price",
      "local_price": {
        "amount": amount,
        "currency": "USD"
      },
      "metadata": {
        "customer_id": playfabId,
        "customer_name": name,
        "receiptId": randomid,
      },
      "redirect_url": `${process.env.API_URL}coin/success?id=${encryptxt}`,
      "cancel_url": `${process.env.API_URL}coin/cancel?id=${encryptxt}`,
      "logo_url": "https://res.cloudinary.com/commerce/image/upload/v1694414673/ecdrzy1t31uiw7cjjtfa.png"
    });
    
    
    data.save(function (error, response) {
      AutoReceipt.create({
        receiptId: response.metadata.receiptId,
        orderCode: response.code,
        username: response.metadata.customer_name,
        playerPlayfabId: response.metadata.customer_id,
        subscriptionType: "emerald",
        amount: response.pricing.local.amount,
        playfabToken: playfabToken
      })

      if (response && response.id) {
          Charge.retrieve(response.id, function (error, response) {
              res.json(response);
          });
      }
  });
    
})

router.post("/diamond", async (req, res) => {
  const name = req.body.name;
  const playfabId = req.body.playfabId;
  // const quantity = req.body.quantity;
  const playfabToken = req.body.playfabToken
  let amount;
  let randomid = generateRandomString();
  const encryptxt = encryptString(randomid, secretKey)
  
  await Subscription.findOne({subscriptionName: "Diamond"})
  .then(data => {
      amount = data.amount;
  })
  
  let data = new Charge({
      "name": "Diamond",
      "description": "Diamond Subscription",
      "pricing_type": "fixed_price",
      "local_price": {
        "amount": amount,
        "currency": "USD"
      },
      "metadata": {
        "customer_id": playfabId,
        "customer_name": name,
        "receiptId": randomid,
      },
      "redirect_url": `${process.env.API_URL}coin/success?id=${encryptxt}`,
      "cancel_url": `${process.env.API_URL}coin/cancel?id=${encryptxt}`,
      "logo_url": "https://res.cloudinary.com/commerce/image/upload/v1694414734/n9rci7fftx3ggpzv4sbp.png"
    });
    
    
    data.save(function (error, response) {
      AutoReceipt.create({
        receiptId: response.metadata.receiptId,
        orderCode: response.code,
        username: response.metadata.customer_name,
        playerPlayfabId: response.metadata.customer_id,
        subscriptionType: "3",
        amount: response.pricing.local.amount,
        playfabToken: playfabToken
      })

      if (response && response.id) {
          Charge.retrieve(response.id, function (error, response) {
              res.json(response);
          });
      }
  });
    
})

// 
router.get("/success", Coin.success)
router.get("/cancel", Coin.cancel)
router.post("/find", Coin.find)
router.post("/topupwallet", protect, Coin.findtopup)
router.post("/agentmanualwallet", protect, Coin.agentmanualtopupwallet)
router.post("/createexisting", Coin.createexsisting)
module.exports = router