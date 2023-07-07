const express = require("express")
const app = express()
const path = require('path');

const CHAT_BOT = 'ChatBot';
let chatRoom = ''; // E.g. javascript, node,...
let allUsers = []; // All users in current chat room
const socket = io => {
    // let users = []

    app.use(require('express').static(path.join(__dirname, 'public')));
    
    io.on("connection", (socket) => {
      console.log(`⚡: ${socket.id} user just connected!`)
      
      // Add a user to a room
      socket.on('join_room', (data) => {
          const { username, room } = data; // Data sent from client when join_room event emitted
          
          // Check if the room already has two users
          const roomUsers = io.sockets.adapter.rooms.get(room);
          if (roomUsers && (roomUsers.size >= 2 || room !== username)) {
            // Send an error message to the client indicating that the room is full
            socket.emit('room_full', {
              message: `The room ${room} is already full.`,
            });
            return;
          }

          socket.join(room); // Join the user to a socket room

          // Add this
          let __createdtime__ = Date.now(); // Current timestamp
          // Send message to all users currently in the room, apart from the user that just joined
          socket.to(room).emit('receive_message', {
            message: `${username} has joined the chat room`,
            username: CHAT_BOT,
            __createdtime__,
          });

          // Send welcome msg to user that just joined chat only
          socket.emit('receive_message', {
            message: `Welcome ${username}`,
            username: CHAT_BOT,
            __createdtime__,
          });

          // Save the new user to the room
          chatRoom = room;
          allUsers.push({ id: socket.id, username, room });
          chatRoomUsers = allUsers.filter((user) => user.room === room);
          socket.to(room).emit('chatroom_users', chatRoomUsers);
          socket.emit('chatroom_users', chatRoomUsers);

          socket.on('send_message', (data) => {
            const {image, message, username, room, __createdtime__ } = data;
            io.in(room).emit('receive_message', data); // Send to all users in room, including sender
          });

          socket.on('image message', (data) => {
            // Broadcast the image to all connected clients
            socket.emit('image message', data);          
          });
          // console.log(allUsers)
          
          });

          

        // socket.on('disconnect', () => {
        //   console.log('🔥: A user disconnected');
        //   users = users.filter(user => user.socketID !== socket.id)
        //   io.emit("newUserResponse", users)
        //   socket.disconnect()
        // });
      // ...
    });

    
  
}

module.exports = socket;

// app.use(cors())


   
// http.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });