const express = require("express");
const app = express();
const path = require('path');
// const { v4: uuidv4 } = require('uuid'); // Import UUID library

function leaveRoom(userID, chatRoomUsers) {
  return chatRoomUsers.filter((user) => user.id !== userID);
}

const socket = io => {
  const CHAT_BOT = 'ChatBot';
  let chatRoom = '';
  let adminrooms = {};
  let allUsers = [];
  let chatRoomUsers;
  let queue = {}; // Store queues for each room
  let __createdtime__ = Date.now();
  app.use(require('express').static(path.join(__dirname, 'public')));

  io.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('create-room', (username, room) => {
      console.log(`${room} was created`)
      // socket.join(room)
      // socket.emit('join_room', {username, room})
      adminrooms[room] = true;
      io.emit('room_created', {room: room})
    })

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
        queue[room].push({ id: socket.id, username });
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
        const user = allUsers.find((user) => user.id === socket.id);
        if (user?.username) {
          allUsers = leaveRoom(socket.id, allUsers);
          socket.to(chatRoom).emit('chatroom_users', allUsers);
          socket.to(chatRoom).emit('receive_message', {
            message: `${user.username} has disconnected from the chat.`,
            __createdtime__,
          });

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
