const express = require("express");
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

// For Binance Pay functions
function hash_signature(query_string) {
    return crypto
        .createHmac('sha512', process.env.SK)
        .update(query_string)
        .digest('hex');
}
// this is for nonce
function random_string() {
    return crypto.randomBytes(32).toString('hex').substring(0,32);
}

router.post('/binancepay/*', (req, res) => {
    const http_method = 'POST'; // Set the desired HTTP method
    const path = req // Extract the path from the request URL
    const payload = req.body; // Use the request body as the payload
    const timestamp = Date.now();
    const nonce = random_string();
    const payload_to_sign = timestamp + "\n" + nonce + "\n" + JSON.stringify(payload) + "\n";
    const url = process.env.URL + path;
    const signature = hash_signature(payload_to_sign);
    axios.create({
      baseURL: url, // Use `url` instead of `baseURL`
      headers: {
        'content-type': 'application/json',
        'BinancePay-Timestamp': timestamp,
        'BinancePay-Nonce': nonce,
        'BinancePay-Certificate-SN': process.env.APIKEY,
        'BinancePay-Signature': signature.toUpperCase()
      }
    }).request({
      method: http_method, // Use `method` instead of `'method'`
      url,
      data: payload
    }).then(response => {
        res.status(response.status).json(response.data);
    }).catch(error => {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});



module.exports = router;