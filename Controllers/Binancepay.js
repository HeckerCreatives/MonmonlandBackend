const axios = require('axios');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
require('dotenv').config();

// For Binance Pay
function hash_signature(query_string) {
    return crypto
        .createHmac('sha512', process.env.SK)
        .update(query_string)
        .digest('hex');
}

function random_string() {
    return crypto.randomBytes(32).toString('hex').substring(0,32);
}

function dispatch_request(http_method, path, payload = {}) {
    const timestamp = Date.now()
    const nonce = random_string()
    const payload_to_sign = timestamp + "\n" + nonce + "\n" + JSON.stringify(payload) + "\n"
    const url = process.env.URL + path
    const signature = hash_signature(payload_to_sign)
    return axios.create({
      baseURL,
      headers: {
        'content-type': 'application/json',
        'BinancePay-Timestamp': timestamp,
        'BinancePay-Nonce': nonce,
        'BinancePay-Certificate-SN': process.env.APIKEY,
        'BinancePay-Signature': signature.toUpperCase()
      }
    }).request({
      'method': http_method,
      url,
      data: payload
    })
}

module.exports.createOrder = (req, res) => {
    const { body } = req.body
    const { url } = req.params.url

    dispatch_request(
        'POST',
        url,
        body
    )
    .then(response => {
        res.status(response.status).json(response.data)
    })
    .catch(error => {
        {
            if (error.response) {
              res.status(error.response.status).json(error.response.data);
            } else {
            res.status(500).json({ error: 'Internal server error' });
            }
        }
    }) 
}
// End for Binance Pay


// module.exports.bpcreateorder = async (req, res) => {
  
//     const { method, originalUrl, body } = req;
//     const nonce = random_string();
//     const secretKey = process.env.SK;
//     const payload = timestamp + "\n" + nonce + "\n" + JSON.stringify(body) + "\n";
//     const signature = CryptoJS.HmacSHA512(payload, secretKey).toString(CryptoJS.enc.Hex).toUpperCase();
    
//     try {
//       const url = `https://bpay.binanceapi.com${originalUrl}`;
//       const headers = { 
//           'Content-Type': 'application/json',
//           'BinancePay-Timestamp': timestamp,
//           'BinancePay-Nonce': nonce,
//           'BinancePay-Certificate-SN': process.env.APIKEY,
//           'BinancePay-Signature': signature
          
//       };
//       const response = await axios({ method, url, data: body, headers });
      
//       res.status(response.status).json(response.data);
//     } catch (error) {
//       if (error.response) {
//         res.status(error.response.status).json(error.response.data);
//       } else {
//         res.status(500).json({ error: 'Internal server error' });
//       }
//     }
//   };