const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const PORT = 4000

const socket = io => {
    let users = []

    io.on('connection', (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`)  
        socket.on("message", data => {
          io.emit("messageResponse", data)
        })
    
        socket.on("typing", data => (
          socket.broadcast.emit("typingResponse", data)
        ))
    
        socket.on("newUser", data => {
          users.push(data)
          io.emit("newUserResponse", users)
        })
     
        socket.on('disconnect', () => {
          console.log('🔥: A user disconnected');
          users = users.filter(user => user.socketID !== socket.id)
          io.emit("newUserResponse", users)
          socket.disconnect()
        });
    });
}

module.exports = socket;

// app.use(cors())


   
// http.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });