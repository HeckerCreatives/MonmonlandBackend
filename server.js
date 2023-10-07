const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const port = 4000;
const app = express();
const cors = require("cors")
require('dotenv').config();
const axios = require('axios');


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
    origin: "http://localhost:3000",
    // origin: ["http://localhost:3000","https://monmontestwebsite.onrender.com/","https://monmontestwebsite.onrender.com","https://monmontestserver-lotk.onrender.com","https://monmontestserver-lotk.onrender.com/", "https://mon-mon-land-dashboard-website.vercel.app/", 'https://mon-mon-land-dashboard-website.vercel.app'],
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
app.use(BinancePay);

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

server.listen(port, ()=> console.log(`Server is running at port ${port}`));