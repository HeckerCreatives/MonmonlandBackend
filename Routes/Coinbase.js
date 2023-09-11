const express = require("express");
const router = express.Router();
var coinbase = require('coinbase-commerce-node');
var Client = coinbase.Client;
var Charge = coinbase.resources.Charge;
var Checkout = coinbase.resources.Checkout;
Client.init(process.env.coinbase);
require('dotenv').config();

const Subscription = require("../Models/Subscription")

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
  
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
  }

router.post("/ruby", async (req, res) => {
    const name = req.body.name;
    let amount;
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
          "customer_id": generateRandomString(),
          "customer_name": name
        },
        "redirect_url": "https://monmonland.games/",
        "cancel_url": "https://monmonland.games/",
        "logo_url": "https://res.cloudinary.com/commerce/image/upload/v1694414488/kriawk9fv7yvdayongng.png"
      });
      
      
      data.save(function (error, response) {
        console.log('Created charge(callback)');
        console.log(response);
        console.log(error);
    
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
    let amount;
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
          "customer_id": generateRandomString(),
          "customer_name": name
        },
        "redirect_url": "https://monmonland.games/",
        "cancel_url": "https://monmonland.games/",
        "logo_url": "https://res.cloudinary.com/commerce/image/upload/v1694414673/ecdrzy1t31uiw7cjjtfa.png"
      });
      
      
      data.save(function (error, response) {
        console.log('Created charge(callback)');
        console.log(response);
        console.log(error);
    
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
    let amount;
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
          "customer_id": generateRandomString(),
          "customer_name": name
        },
        "redirect_url": "https://monmonland.games/",
        "cancel_url": "https://monmonland.games/",
        "logo_url": "https://res.cloudinary.com/commerce/image/upload/v1694414734/n9rci7fftx3ggpzv4sbp.png"
      });
      
      
      data.save(function (error, response) {
        console.log('Created charge(callback)');
        console.log(response);
        console.log(error);
    
        if (response && response.id) {
            Charge.retrieve(response.id, function (error, response) {
                console.log('Retrived charge(callback)');
                res.json(response);
                console.log(error);
            });
        }
    });
      
})

module.exports = router