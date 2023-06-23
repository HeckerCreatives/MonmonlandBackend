const express = require("express");
const mongoose = require("mongoose");
// const axios = require('axios');
// const CryptoJS = require('crypto-js');
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
const BinancePay = require("./Routes/Binancepay")
const Games = require("./Routes/Games")

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
app.use(BinancePay);

app.listen(port, ()=> console.log(`Server is running at port ${port}`));