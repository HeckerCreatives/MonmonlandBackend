const express = require("express");
const mongoose = require("mongoose");
const axios = require('axios');
const CryptoJS = require('crypto-js');
const port = 4000;
const app = express();
const cors = require("cors")
require('dotenv').config();



const Gameactivity = require("./Routes/Gameactivity");
const Subscription = require("./Routes/Subscription");
const News = require("./Routes/News");
const Roadmap = require("./Routes/Roadmap");
const User = require("./Routes/Users");
const Migrate = require("./Routes/Migrate");
const Auth = require("./Routes/Auth");
const ManagePlayer = require("./Routes/Manageplayer");


// [MongoDB connection]
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGOOSE_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// [error handling]
let db = mongoose.connection;
db.on('error', ()=> console.error.bind(console, "Connection to Database has an Error!"));
db.once('open', ()=> console.log("We are now Connected to the Cloud."))

// [Middleware]
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

// For Binance Pay 
const timestamp = new Date().getTime();

const generateString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
app.all('/binancepay/*', async (req, res) => {
  
    const { method, originalUrl, body } = req;
    const nonce = generateString(32);
    const secretKey = process.env.SK;
    const payload = timestamp + "\n" + nonce + "\n" + JSON.stringify(body) + "\n";
    const signature = CryptoJS.HmacSHA512(payload, secretKey).toString(CryptoJS.enc.Hex).toUpperCase();
    
    try {
      const url = `https://bpay.binanceapi.com${originalUrl}`;
      const headers = { 
          'Content-Type': 'application/json',
          'BinancePay-Timestamp': timestamp,
          'BinancePay-Nonce': nonce,
          'BinancePay-Certificate-SN': process.env.APIKEY,
          'BinancePay-Signature': signature
          
      };
      const response = await axios({ method, url, data: body, headers });
      console.log("jashdasdh")
      res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });
// End for Binance Pay 

// [Routing]
app.use("/gameactivity", Gameactivity);
app.use("/subscription", Subscription);
app.use("/news", News);
app.use("/roadmap", Roadmap);
app.use("/user", User);
app.use("/migrate", Migrate);
app.use("/auth", Auth);
app.use("/manage", ManagePlayer);

app.listen(port, ()=> console.log(`Server is running at port ${port}`));