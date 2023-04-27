const express = require("express");
const mongoose = require("mongoose");
const port = 4000;
const app = express();
const cors = require("cors")
require('dotenv').config();



const Gameactivity = require("./Routes/Gameactivity");
const Subscription = require("./Routes/Subscription");
const News = require("./Routes/News");
const Roadmap = require("./Routes/Roadmap");

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

app.listen(port, ()=> console.log(`Server is running at port ${port}`));