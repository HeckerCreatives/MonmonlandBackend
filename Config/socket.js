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
  let kikroomusers=[];
  let userdetails=[];
  app.use(require('express').static(path.join(__dirname, 'public')));

  io.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    // const list = io.sockets.adapter.rooms
    
    socket.on('create-room', (username, room) => {
      UpgradeSubscription.find({userId: room})
      .populate({path: "userId"})
      .then((data) => {
        const item = data.filter(item => !item.deletedAt)
        adminrooms.push({id: socket.id,user: username, item})
      })
      // socket.join(room);
    })
    io.emit('room_created', {room: adminrooms,})

    socket.on('join_room', (data) => {
      const { username, room, playfabid } = data;
      const roomUsers = io.sockets.adapter.rooms.get(room);

      if(adminrooms.length !== 0){
        io.emit('ifqueue', {no:roomUsers?.size});
      }
       
      if (!roomUsers || roomUsers.size < 2) {
        socket.join(room);

        const userDetails = {
          id: socket.id,
          username,
          room,
          playfabid,
        };
        userdetails.push({ id: socket.id, userDetails });
        io.emit("details", userdetails)

        
        
        

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
      // Listen for 'doneTransaction' event from admin
      socket.on('doneTransaction', (room, normalUserId) => {
        const user = adminrooms.find(e => e.id)
        // Find the normal user's socket
        const normalUserSocket = io.sockets.sockets.get(normalUserId);
        const adminsocket = io.sockets.sockets.get(user.id);
        const roomusers = allUsers.filter((user) => user.id !== normalUserId);
        kikroomusers.push({id: roomusers[0].id, username: roomusers[0].username})
        const usertokick = io.sockets.sockets.get(roomusers[0].id)
        if (user.id !== normalUserId) {
        
          // Remove the normal user from the chat room
          normalUserSocket.leave(room);
          // Emit 'kicked' event to the normal user
          normalUserSocket.emit('kicked');
          adminsocket.emit('ey')
        } else {
          // Remove the normal user from the chat room
          usertokick.leave(room);
          // Emit 'kicked' event to the normal user
          usertokick.emit('kicked');
          adminsocket.emit('ey')
        }
        
      });

      socket.on('leave', (room) => {
        const user = adminrooms.find(e => e.id)
        const adminsocket = io.sockets.sockets.get(user.id);
        adminsocket.leave(room)
        adminsocket.emit("alis")
      })

      socket.on('isonline', (id) => {
        const user = adminrooms.find(e => e.id)
        const adminsocket = io.sockets.sockets.get(id);
        if(id === user.id){
          adminsocket.emit("onlinenga")
        } 
      })

      socket.on('buyer', (data) => {
        io.emit('buyerdata', {item: data})
      })
     
      socket.on('selectsubs', (data) => {
        io.emit('badge', {item: data})
      })

      socket.on('send_message', (data) => {
        const { image, message, username, room, __createdtime__ } = data;
        io.in(room).emit('receive_message', data);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected from the chat');
        
        const user = allUsers.find((user) => user.id === socket.id);
        const admin = adminrooms.find(admin => admin.id === socket.id)
        const kik = kikroomusers.find(kik => kik.id === socket.id)
        const detail = userdetails.find(detail => detail.id === socket.id)
        // adminrooms = adminrooms.filter((admin) => admin.id !== socket.id);
        //   io.sockets.sockets.delete(socket.id);
        if (user?.username) {
          allUsers = leaveRoom(socket.id, allUsers);
          socket.to(chatRoom).emit('chatroom_users', allUsers);
          socket.to(chatRoom).emit('receive_message', {
            message: `${user.username} has disconnected from the chat.`,
            __createdtime__,
          });
          
        if(admin?.id){
          adminrooms = leaveRoom(socket.id, adminrooms)
          chatRoomUsers.forEach((user) => {
            const userSocket = io.sockets.sockets.get(user.id);
            if (userSocket) {
              userSocket.emit('walasiadmin', {
                message: 'Admin has disconnected.',
              });
              userSocket.leave(room); // Remove the user from the admin room
            }
          });

          // Remove all users in the queue for this admin room
          if (queue[room]) {
            queue[room].forEach((queuedUser) => {
              const queuedUserSocket = io.sockets.sockets.get(queuedUser.id);
              if (queuedUserSocket) {
                queuedUserSocket.emit('queue_message', {
                  message: 'Admin has disconnected.',
                });
                delete queuedUsers[queuedUser.id];
              }
            });
            queue[room] = []; // Clear the queue for this admin room
          }

          // Remove the admin room from the list of admin rooms
          adminrooms = adminrooms.filter((admin) => admin.id !== socket.id);

          // Remove the admin socket
          io.sockets.sockets.delete(socket.id);
        }

        if(kik?.id){
          kikroomusers = leaveRoom(socket.id, kikroomusers)
        }

        if(detail?.id){
          userdetails = leaveRoom(socket.id, userdetails)
        }

        if (queuedUsers[socket.id]) {
          delete queuedUsers[socket.id]; // Remove the user from the queued users
          queue[chatRoom] = queue[chatRoom].filter(user => user.id !== socket.id);
          // Recalculate and update the queue position for the remaining users in the queue
          if (queue[chatRoom]) {
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
