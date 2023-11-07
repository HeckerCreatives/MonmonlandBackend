const express = require("express");
const router = express.Router();
const Nowpayment = require('../Nowpayment/nowpayment');
const AutoReceipt = require("../Models/Receiptautomated")
var axios = require('axios');

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
  
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
}

// router.post('/funds', Nowpayment.createinvoicefunds)
router.post("/bundles", Nowpayment.createinvoicebundles)
router.post("/verify", Nowpayment.verifypayments)

// Route for creating an invoice
router.post('/funds', async (req, res) => {
    try {
      // Generate a random order ID
      const randomid = generateRandomString();
  
      // Extract data from the request body
      const { amount, playfabToken, username, playerPlayfabId } = req.body;
  
      // Prepare data for the invoice
      const invoiceData = {
        price_amount: amount,
        price_currency: 'usd',
        order_id: randomid,
        order_description: `Top Up $${amount}`,
        ipn_callback_url: 'https://mml-test-api.onrender.com/nowpay/verify',
        success_url: 'https://monmonland.games/',
        cancel_url: 'https://monmonland.games/',
        is_fixed_rate: true,
        is_fee_paid_by_user: true,
      };
  
      // Make an API request to create the invoice
      const response = await axios.post('https://api-sandbox.nowpayments.io/v1/invoice', invoiceData, {
        headers: {
          'x-api-key': process.env.npapikey,
          'Content-Type': 'application/json',
        },
      });
  
      // Assuming you have a database model for transactions (AutoReceipt), store the transaction data
      const transactionData = {
        receiptId: response.data.order_id,
        orderCode: response.data.id,
        username: username,
        playerPlayfabId: playerPlayfabId,
        subscriptionType: `Top Up $${response.data.price_amount}`,
        amount: response.data.price_amount,
        playfabToken: playfabToken,
      };
      
      // Handle storing the transaction data in the database (implementation not shown here)
      await AutoReceipt.create(transactionData)
      // Send a success response to the client
      res.json({ message: 'success', data: response.data });
    } catch (error) {
      // Handle errors and send an appropriate error response
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the invoice.' });
    }
  });
module.exports = router

