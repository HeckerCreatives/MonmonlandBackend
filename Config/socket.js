const express = require("express");
const app = express();
const path = require('path');
const UpgradeSubscription = require('../Models/UpgradeSubscription')

function leaveRoom(userID, chatRoomUsers) {
  return chatRoomUsers.filter((user) => user.id !== userID);
}



const socket = io => {
  const CHAT_BOT = 'ChatBot';
  let chatRoom = '';
  let adminrooms = [];
  let allUsers = [];
  let chatRoomUsers;
  let queue = {}; // Store queues for each room
  let queuedUsers = {}
  let __createdtime__ = Date.now();
  app.use(require('express').static(path.join(__dirname, 'public')));

  io.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    // const list = io.sockets.adapter.rooms
    
    socket.on('create-room', (username, room) => {
      UpgradeSubscription.find({userId: room})
      .populate({path: "userId"})
      .then((data) => {
        const item = data.filter(item => !item.deletedAt)
        adminrooms.push({id: socket.id, item})
      })
      // adminrooms[room] = true;
    })
    io.emit('room_created', {room: adminrooms,})

    socket.on('join_room', (data) => {
      const { username, room } = data;
      const roomUsers = io.sockets.adapter.rooms.get(room);     
      
      if (!roomUsers || roomUsers.size < 2) {
        socket.join(room);
        
        socket.to(room).emit('receive_message', {
          message: `${username} has joined the chat room`,
          username: CHAT_BOT,
          __createdtime__,
        });


        socket.emit('receive_message', {
          message: `Welcome ${username}`,
          username: CHAT_BOT,
          __createdtime__,
        });
        
        chatRoom = room;
        allUsers.push({ id: socket.id, username, room,});
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);
      } else {
        // Queue the user and emit a queue message
       
        if (!queue[room]) {
          queue[room] = [];
        }
        queue[room].push({ id: socket.id, username,});
        queuedUsers[socket.id] = true;
        const queuePosition = queue[room].length;
        socket.emit('queue_message', {
          message: `The room is currently full. your queing number is ${queuePosition}.`,
        });
      }

      socket.on('send_message', (data) => {
        const { image, message, username, room, __createdtime__ } = data;
        io.in(room).emit('receive_message', data);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected from the chat');
        queue[chatRoom] = queue[chatRoom].filter(user => user.id !== socket.id);
        const user = allUsers.find((user) => user.id === socket.id);
        const admin = adminrooms.find(admin => admin.id === socket.id)
        if (user?.username) {
          allUsers = leaveRoom(socket.id, allUsers);
          socket.to(chatRoom).emit('chatroom_users', allUsers);
          socket.to(chatRoom).emit('receive_message', {
            message: `${user.username} has disconnected from the chat.`,
            __createdtime__,
          });
        
        if(admin?.id){
          adminrooms = leaveRoom(socket.id, adminrooms)
        }

        if (queuedUsers[socket.id]) {
          delete queuedUsers[socket.id]; // Remove the user from the queued users
          
          // Recalculate and update the queue position for the remaining users in the queue
          if (queue[chatRoom] || queuedUsers[socket.id]) {
            queue[chatRoom] = queue[chatRoom].filter(user => user.id !== socket.id);
            // const remainingQueueLength = queue[chatRoom].length;
      
            // Update queue positions for remaining users
            queue[chatRoom].forEach((user, index) => {
              const userSocket = io.sockets.sockets.get(user.id);
              if (userSocket) {
                const updatedPosition = index + 1; // Queue position is 1-based
                userSocket.emit('queue_message', {
                  message: `The room is currently full. Your updated queuing number is ${updatedPosition}.`,
                });
              }
            });
            
          }}
      
        
        
          // Handle queue
        if (queue[chatRoom] && queue[chatRoom].length > 0) {
          const nextUser = queue[chatRoom].shift();
          const nextSocket = io.sockets.sockets.get(nextUser.id);

          if (nextSocket) {
            nextSocket.join(chatRoom);
            nextSocket.emit('queue_message', {
              message: `Now its your turn.`,
            });
            allUsers.push({ id: nextUser.id, username: nextUser.username, room: chatRoom });
            chatRoomUsers = allUsers.filter((user) => user.room === chatRoom);
            io.in(chatRoom).emit('chatroom_users', chatRoomUsers);
            nextSocket.to(chatRoom).emit('receive_message', {
              message: `${nextUser.username} has joined the chat room`,
              username: CHAT_BOT,
              __createdtime__,
            });
          }
        }
        }
      });
      
    });
  });
}

module.exports = socket;
