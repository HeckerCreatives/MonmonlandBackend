const express = require("express")
const app = express()
const path = require('path');


const socket = io => {
    // let users = []

    app.use(require('express').static(path.join(__dirname, 'public')));
    
    io.on("connection", (socket) => {
      const users = [];
      for (let [id] of io.of("/").sockets) {
        users.push({
          userID: id,
          // username: socket.username,
        });
      }
      socket.emit("users", users);

      socket.join(socket.id);
        
        socket.on("private message", ({ content, to }) => {
          const message = {
            content,
            from: socket.id,
            to,
          };
          socket.to(to).to(socket.id).emit("private message", message);
          console.log(message)
        });

        socket.on('image message', (data) => {
          // Broadcast the image to all connected clients
          socket.emit('image message', data);          
        });

        // socket.on('disconnect', () => {
        //   console.log('🔥: A user disconnected');
        //   users = users.filter(user => user.socketID !== socket.id)
        //   io.emit("newUserResponse", users)
        //   socket.disconnect()
        // });
      // ...
    });

    
    // io.on('connection', (socket) => {
    //     console.log(`⚡: ${socket.id} user just connected!`)

    //     // socket.on("message", data => {
    //     //   io.emit("messageResponse", data)
    //     // })
    
    //     // socket.on("typing", data => (
    //     //   socket.emit("typingResponse", data)
    //     // ))
    
    //     // socket.on("privateChat", ({ senderId, recipientId, message, data }) => {
    //     //   // Find the recipient socket by their ID
    //     //   const recipientSocket = io.sockets.sockets.get(recipientId);
    //     //   if (recipientSocket) {
    //     //     // Emit the private message to the recipient
    //     //     recipientSocket.emit("privateChatResponse", {
    //     //       senderId,
    //     //       message,
    //     //       data
    //     //     });
    //     //   } else {
    //     //     // Handle if the recipient is not found (e.g., user not connected)
    //     //     console.log(`Recipient socket not found: ${recipientId}`);
    //     //   }
    //     // });
        
        
    //     // socket.on("newUser", data => {
    //     //   users.push(data)
    //     //   io.emit("newUserResponse", users)
    //     // })

    //     // socket.on('image message', (data) => {
    //     //   // Broadcast the image to all connected clients
    //     //   socket.emit('image message', data);          
    //     // });

    //     // socket.on('disconnect', () => {
    //     //   console.log('🔥: A user disconnected');
    //     //   users = users.filter(user => user.socketID !== socket.id)
    //     //   io.emit("newUserResponse", users)
    //     //   socket.disconnect()
    //     // });
    // });
}

module.exports = socket;

// app.use(cors())


   
// http.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });