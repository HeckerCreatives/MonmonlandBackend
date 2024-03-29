const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const port = 4000;
const app = express();
const cors = require("cors")
require('dotenv').config();
const axios = require('axios');
const cookieParser = require('cookie-parser');

const Gameactivity = require("./Routes/Gameactivity");
const Subscription = require("./Routes/Subscription");
const News = require("./Routes/News");
const Roadmap = require("./Routes/Roadmap");
const User = require("./Routes/Users");
const Migrate = require("./Routes/Migrate");
const Auth = require("./Routes/Auth");
const ManagePlayer = require("./Routes/Manageplayer");
const BinancePay = require("./Routes/Binancepay")
const Games = require("./Routes/Games")
const UpgradeSubscription = require("./Routes/UpgradeSubscription")
const Coin = require("./Routes/Coinbase")
const Payout = require("./Routes/Payout")
const Wallet = require("./Routes/Wallets")
const Playfabs = require("./Routes/Playfabs")
const Subsuser = require("./Routes/SubscriptionUser")
const Subsaccu = require("./Routes/SubsAccumulated")
const Merchandise = require("./Routes/Merchandise")
const Totalusers = require("./Routes/Totalusers")
const Monmoncoin = require("./Routes/Monmoncoin")
const Apk = require("./Routes/Apk")
const Upload = require("./Routes/Upload")
const Withdraw = require("./Routes/Withdrawal")
const Topupresolve = require("./Routes/Topupresolver")
const Ads = require("./Routes/Ads")
const Leaderboard = require("./Routes/Leaderboard")
const Communityactivity = require("./Routes/Communityactivity")
const Nowpayment = require("./Routes/Nowpayment")
const Investorfund = require("./Routes/Investorfunds")
const Dragonpay = require("./Routes/Dragonpay");
const Exchangerate = require("./Routes/Exchangerate");
const Trade = require("./Routes/Trade")
const Unilevel = require("./Routes/Unilevel")
const Dragonpayout = require("./Routes/Dragonpayout")
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

const corsConfig = {
    // origin: "http://localhost:3000",
    origin: ["http://localhost:3000","https://monmonlandwebsite.onrender.com/","https://monmonlandwebsite.onrender.com"],
    // origin: ["https://www.monmonland.games/", "https://www.monmonland.games", 
    //   "https://monmonland.games/", "https://monmonland.games"],
    methods: ["GET", "POST", "PUT", "DELETE"], // List only` available methods
    credentials: true, // Must be set to true
    allowedHeaders: [
      "Origin",
      "Content-Type",
      "X-Requested-With",
      "Accept",
      "Authorization",
    ], // Allowed Headers to be received
  };

// [Middleware]
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors(corsConfig))

const server = http.createServer(app);

const io = new Server(server, {
    cors: corsConfig, // Pass configuration to websocket
});

require('./Config/socket')(io)
// [Routing]
app.use('/unilevel', Unilevel)
app.use('/trade', Trade)
app.use("/dragonpay", Dragonpay)
app.use("/gameactivity", Gameactivity);
app.use("/subscription", Subscription);
app.use("/news", News);
app.use("/roadmap", Roadmap);
app.use("/user", User);
app.use("/migrate", Migrate);
app.use("/auth", Auth);
app.use("/manage", ManagePlayer);
app.use("/games", Games);
app.use("/upgradesubscription", UpgradeSubscription);
app.use("/coin", Coin);
app.use("/payout", Payout);
app.use("/wallet", Wallet);
app.use("/monmon", Playfabs)
app.use("/subsuser", Subsuser)
app.use("/subsaccu", Subsaccu)
app.use("/merchandise", Merchandise)
app.use("/totalusers", Totalusers)
app.use("/monmoncoin", Monmoncoin)
app.use("/apk", Apk)
app.use("/upload", Upload)
app.use("/withdrawfee", Withdraw)
app.use("/topupresolver", Topupresolve)
app.use("/ads", Ads)
app.use("/leaderboard", Leaderboard)
app.use("/communityactivy", Communityactivity)
app.use("/nowpay", Nowpayment)
app.use("/investor", Investorfund)
app.use("/usdrate", Exchangerate)
app.use("/dragonpayout", Dragonpayout)
app.use(BinancePay);
app.use("/uploads", express.static("uploads"))
app.use("/tempuploads", express.static("tempuploads"))
app.use("/receiptuploads", express.static("receiptuploads"))
app.use('/etcuploads', express.static('etcuploads'));
app.use(cookieParser())
const apiUrl = process.env.worldtimeapi

app.get('/phtime', async (req, res) => {
  try {
    const response = await axios.get(apiUrl);
    // Return the API response as the result
    res.json(response.data);
  } catch (error) {
    console.error('Request failed:', error);
    res.status(500).json({ error: 'Something went wrong', data: error });
  }
});

// Game Route
require('./Gameroutes')(app)
require('./Admingameroutes')(app)
server.listen(port, ()=> console.log(`Server is running at port ${port}`));