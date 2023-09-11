var coinbase = require('coinbase-commerce-node');
var Client = coinbase.Client;
const axios = require('axios');
Client.init(process.env.coinbase);
require('dotenv').config();
function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
  
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
  }

module.exports.createcharge = (req, res) => {
    const {name} = req.body;
    let data = JSON.stringify({
        "name": "Ruby",
        "description": "Ruby Subscription",
        "pricing_type": "fixed_price",
        "local_price": {
            "amount": "25.00",
          "currency": "USD"
        },
        "metadata": {
          "customer_id": generateRandomString(),
          "customer_name": name
        },
        "redirect_url": "https://monmonland.games/",
        "cancel_url": "https://monmonland.games/"
      });
      
      let config = {
        method: 'post',
        url: 'https://api.commerce.coinbase.com/charges',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json', 
          'X-CC-Version': `${process.env.coinbase}`
        },
        data : data
      };
      
      axios(config)
      .then((response) => {
        res.json(JSON.stringify(response.data));
      })
      .catch((error) => {
        res.json(error);
      });
}


