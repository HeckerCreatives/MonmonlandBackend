const express = require("express")
const app = express()
const path = require('path');

const CHAT_BOT = 'ChatBot';
let chatRoom = ''; // E.g. javascript, node,...
let allUsers = []; // All users in current chat room
let roomOwnerUsername = [];

function leaveRoom(userID, chatRoomUsers) {
  return chatRoomUsers.filter((user) => user.id != userID);
}

const socket = io => {
    // let users = []


    app.use(require('express').static(path.join(__dirname, 'public')));
    
    io.on("connection", (socket) => {
      console.log(`⚡: ${socket.id} user just connected!`)
      
      // Add a user to a room
      socket.on('join_room', (data) => {
          const { username, room } = data; // Data sent from client when join_room event emitted

           // Check if the room already has two users || 
           const roomUsers = io.sockets.adapter.rooms.get(room);
           if (roomUsers && (roomUsers.size >= 2 && room !== username)) {
             // Send an error message to the client indicating that the room is full
             socket.emit('room_full', {
               message: `The Admin is still Processing other transaction`,
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

          // Find the room owner's socket ID
          const roomOwnerSocket = chatRoomUsers.find(user => user.username === room);
          
          if (roomOwnerSocket && roomOwnerSocket.id !== socket.id) {
            // Send a notification to the room owner
            io.to(roomOwnerSocket.id).emit('receive_notification', {
              message: `${username} has joined your chat room`             
            });
          }

          socket.on('send_message', (data) => {
            const {image, message, username, room, __createdtime__ } = data;
            io.in(room).emit('receive_message', data); // Send to all users in room, including sender
          });

          socket.on('leave_room', (data) => {
            const { username, room } = data;
            socket.leave(room);
            const __createdtime__ = Date.now();
            // Remove user from memory
            allUsers = leaveRoom(socket.id, allUsers);
            socket.to(room).emit('chatroom_users', allUsers);
            socket.to(room).emit('receive_message', {
              username: CHAT_BOT,
              message: `${username} has left the chat`,
              __createdtime__,
            });
            console.log(`${username} has left the chat`);
          });

          socket.on('disconnect', () => {
            console.log('User disconnected from the chat');
            const user = allUsers.find((user) => user.id == socket.id);
            if (user?.username) {
              allUsers = leaveRoom(socket.id, allUsers);
              socket.to(chatRoom).emit('chatroom_users', allUsers);
              socket.to(chatRoom).emit('receive_message', {
                message: `${user.username} has disconnected from the chat.`,
                __createdtime__,
              });
            }
          });

           // Check if the user trying to join is the room owner
           if (username !== room) {
            // Find the room owner's socket ID
            const roomOwnerSocket = chatRoomUsers.find(user => user.username === room);

            // If the room owner is not in the room, send an error message to the user
            if (!roomOwnerSocket || !roomUsers.has(roomOwnerSocket.id)) {
              socket.emit('room_not_allowed', {
                message: `You cannot join this room. The room owner is not present.`,
              });
              return;
            }
          }

          
          
          });
    });

    
  
}

module.exports = socket;

// app.use(cors())


   
// http.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });