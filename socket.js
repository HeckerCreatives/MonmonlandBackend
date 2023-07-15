// const express = require("express");
// const app = express();
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// app.use(cors());
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:3000","https://monmontestwebsite.onrender.com/","https://monmontestwebsite.onrender.com", "https://mon-mon-land-dashboard-website.vercel.app/","https://mon-mon-land-dashboard-website.vercel.app"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//     allowedHeaders: [
//       "Origin",
//       "Content-Type",
//       "X-Requested-With",
//       "Accept",
//       "Authorization",
//     ],
//   },
// });

// io.on("connection", socket => {
//   console.log(`connection established by: ${socket.id}`);

//   socket.on("send_message", data => {
//     socket.broadcast.emit("receive_message", data.chat);
//   });
// });

// server.listen(4000, () => {
//   console.log("connected to 4000");
// });
