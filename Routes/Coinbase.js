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



router.post("/ruby", async (req, res) => {
    const name = req.body.name;
    const playfabId = req.body.playfabId;
    const quantity = req.body.quantity;
    let amount;
    let randomid = generateRandomString();
    const encryptxt = encryptString(randomid, secretKey);
    
    await Subscription.findOne({subscriptionName: "Ruby"})
    .then(data => {
        amount = data.amount * quantity;
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
        "redirect_url": `${process.env.WEBSITE_URL}payment/success?id=${encryptxt}`,
        "cancel_url": `${process.env.WEBSITE_URL}payment/cancel?id=${encryptxt}`,
        "logo_url": "https://res.cloudinary.com/commerce/image/upload/v1694414488/kriawk9fv7yvdayongng.png"
      });
      
      
      data.save(function (error, response) {
        console.log('Created charge(callback)');
        console.log(error);
        AutoReceipt.create({
          receiptId: response.metadata.receiptId,
          orderCode: response.code,
          username: response.metadata.customer_name,
          playerPlayfabId: response.metadata.customer_id,
          subscriptionType: "1",
          amount: response.pricing.local.amount,
        })

        if (response && response.id) {
            Charge.retrieve(response.id, function (error, response) {
                console.log('Retrived charge(callback)');
                res.json(response);
                console.log(error);
            });
        }
    });
      
})


router.post("/emerald", async (req, res) => {
  const name = req.body.name;
  const playfabId = req.body.playfabId;
  const quantity = req.body.quantity;
  let amount;
  let randomid = generateRandomString();
  const encryptxt = encryptString(randomid, secretKey)
  
  await Subscription.findOne({subscriptionName: "Emerald"})
  .then(data => {
      amount = data.amount * quantity;
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
      "redirect_url": `${process.env.WEBSITE_URL}payment/success?id=${encryptxt}`,
      "cancel_url": `${process.env.WEBSITE_URL}payment/cancel?id=${encryptxt}`,
      "logo_url": "https://res.cloudinary.com/commerce/image/upload/v1694414673/ecdrzy1t31uiw7cjjtfa.png"
    });
    
    
    data.save(function (error, response) {
      console.log('Created charge(callback)');
      console.log(error);
      AutoReceipt.create({
        receiptId: response.metadata.receiptId,
        orderCode: response.code,
        username: response.metadata.customer_name,
        playerPlayfabId: response.metadata.customer_id,
        subscriptionType: "2",
        amount: response.pricing.local.amount,
      })

      if (response && response.id) {
          Charge.retrieve(response.id, function (error, response) {
              console.log('Retrived charge(callback)');
              res.json(response);
              console.log(error);
          });
      }
  });
    
})

router.post("/diamond", async (req, res) => {
  const name = req.body.name;
  const playfabId = req.body.playfabId;
  const quantity = req.body.quantity;
  let amount;
  let randomid = generateRandomString();
  const encryptxt = encryptString(randomid, secretKey)
  
  await Subscription.findOne({subscriptionName: "Diamond"})
  .then(data => {
      amount = data.amount * quantity;
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
      "redirect_url": `${process.env.WEBSITE_URL}payment/success?id=${encryptxt}`,
      "cancel_url": `${process.env.WEBSITE_URL}payment/cancel?id=${encryptxt}`,
      "logo_url": "https://res.cloudinary.com/commerce/image/upload/v1694414734/n9rci7fftx3ggpzv4sbp.png"
    });
    
    
    data.save(function (error, response) {
      console.log('Created charge(callback)');
      console.log(error);
      AutoReceipt.create({
        receiptId: response.metadata.receiptId,
        orderCode: response.code,
        username: response.metadata.customer_name,
        playerPlayfabId: response.metadata.customer_id,
        subscriptionType: "3",
        amount: response.pricing.local.amount,
      })

      if (response && response.id) {
          Charge.retrieve(response.id, function (error, response) {
              console.log('Retrived charge(callback)');
              res.json(response);
              console.log(error);
          });
      }
  });
    
})

// 
router.post("/success", Coin.success)
router.post("/cancel", Coin.cancel)

module.exports = router