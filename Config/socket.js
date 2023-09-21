const express = require("express");
const app = express();
const path = require('path');
const UpgradeSubscription = require('../Models/UpgradeSubscription');
const User = require('../Models/Users');

const socket = io => {
  const roomlist = {};
  const adminroomowner = {};
  const playerrooms = {};
  const playerlist = {}; // si queueing
  let __createdtime__ = Date.now();
  app.use(require('express').static(path.join(__dirname, 'public')));
  io.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    function getQueNumber(roomname, username){
      const keysArray = Object.keys(playerlist[roomname])
      const queuePosition = keysArray.indexOf(username)
      if(queuePosition > 0){
        socket.emit('queue_message', {
          message: "full",
          data: `The room is currently full. Your updated queuing number is ${queuePosition + 1}.`
        });
      } else if (queuePosition === 0){
        socket.emit('queue_message', {
          message: "turn",
          data: "Now it's your turn."
        })
      }
    }

    socket.on("joinroom", (data) => {
      const { roomid, playfabid, username, transaction } = data;
      User.findOne({userName: username})
      .then(data => {
        if(data){
          if(data.roleId.toString() === process.env.subadminrole || data.roleId.toString() === process.env.csrrole){
            UpgradeSubscription.find({userId: data._id})
            .populate({path: "userId"})
            .then((cashier) => {
              const item = cashier.filter(item => !item.deletedAt)
              roomlist[roomid] = {
                id: socket.id,
                user: username, 
                item,
              }
              adminroomowner[socket.id] = {roomid: roomid}
              playerlist[roomid] = {}
              socket.join(roomid);
              socket.to("lobby").emit("sendroomlist", roomlist)
            })
            
          }
        } else {
          let list = {};
          if(Object.keys(playerlist[roomid]).length !== 0){
            list = playerlist[roomid]
          }

          list[socket.id] = {
            id: socket.id,
            username,
            playfabid,
            transaction
          }
          
          playerlist[roomid] = list
          playerrooms[socket.id] = {room: roomid}
          socket.join(roomid)
          // socket.to(roomlist[roomid].id).emit("playerdetails", list[username])
          getQueNumber(roomid, socket.id);
        }
      })

    });

    socket.on("refreshcashierdata", (data) => {
      roomlist[adminroomowner[socket.id]["roomid"]].item[0].numberoftransaction = data.numberoftransaction;
      roomlist[adminroomowner[socket.id]["roomid"]].item[0].paymentcollected = data.paymentcollected;
      socket.to(adminroomowner[socket.id]["roomid"]).emit("admindetails", roomlist[adminroomowner[socket.id]["roomid"]])
      socket.to("lobby").emit("sendroomlist", roomlist)
    })

    socket.on("joinlobby", () => {
      socket.join("lobby")
    })

    socket.on("receiveroomlist", () => {
      socket.emit("sendroomlist", roomlist)
    })
    
    socket.on("playerready", (data) => {
      const {room, username} = data;
      socket.emit("admindetails", roomlist[room])
      socket.to(roomlist[room].id).emit("playerdetails", playerlist[room][socket.id])
      socket.to(roomlist[room].id).emit("receive_message", {
        message: `Welcome ${username}`,
        username: "CHAT_BOT",
        __createdtime__,
      })
    })

    socket.on("send_message", (data) => {
      const { image, message, username, room, __createdtime__, usersocket } = data;
      socket.emit('receive_message', data)
      socket.to(usersocket).emit('receive_message', data)
    })

    socket.on("doneTransactionAdmin", (data) => {
      const { room, buyer } = data;
      socket.to(buyer).emit("kicked")
      
      delete playerlist[room][buyer]
      delete playerrooms[buyer]
      
      socket.to(room).emit("donegetlist")

    })

    socket.on("doneTransactionUser", (data) => {
      // delete playerlist[playerrooms[socket.id]["room"]][socket.id]
      const {roomId} = data
      socket.emit("kicked")
      socket.leave(playerrooms[socket.id]["room"])
      
    })

    socket.on("refreshque", (data) => {
      const {room } = data
      getQueNumber(room, socket.id);
    })

    socket.on('selectsubs', (data) => {
      const {id, subs} = data
      socket.to(id).emit('badge', {item: subs})
    })

    socket.on("cancelTransactionAdmin", (data) => {
      const { room, buyer } = data;
      socket.to(buyer).emit("canceled")
      
      delete playerlist[room][buyer]
      delete playerrooms[buyer]
      
      socket.to(room).emit("donegetlist")

    })

    socket.on("cancelTransactionUser", () => {
      socket.to(roomlist[playerrooms[socket.id]["room"]].id).emit("canceleduser", playerlist[playerrooms[socket.id]["room"]][socket.id])
      
      delete playerlist[playerrooms[socket.id]["room"]][socket.id]
      socket.to(playerrooms[socket.id]["room"]).emit("donegetlist")
      delete playerrooms[socket.id]
      
    })

    socket.on("disconnect", () => {
      console.log('User disconnected from the chat');
      const id = socket.id
      if(adminroomowner.hasOwnProperty(id)){
        socket.to(adminroomowner[id]["roomid"]).emit("queue_message",{
          message: "admindisconnect",
          data: "Admin has disconnected."})
          delete roomlist[adminroomowner[id]["roomid"]]
          delete playerlist[adminroomowner[id]["roomid"]]
          delete adminroomowner[id]
          socket.to("lobby").emit("sendroomlist", roomlist)
      } else if(playerrooms.hasOwnProperty(id)){
        if(playerlist.hasOwnProperty(playerrooms[id]["room"])){
          if(playerlist[playerrooms[id]["room"]].hasOwnProperty(id)){
            socket.to(roomlist[playerrooms[id]["room"]].id).emit("adminrefreshlist", playerlist[playerrooms[id]["room"]][id])
            delete playerlist[playerrooms[id]["room"]][id]
            socket.to(playerrooms[id]["room"]).emit("donegetlist")
            
            delete playerrooms[id]
          }
        }
       
        
      }
      
    })

    socket.on("leave", () => {
      const id = socket.id
      if(adminroomowner.hasOwnProperty(id)){
        socket.to(adminroomowner[id]["roomid"]).emit("queue_message",{
          message: "admindisconnect",
          data: "Admin has disconnected."})
          delete roomlist[adminroomowner[id]["roomid"]]
          delete playerlist[adminroomowner[id]["roomid"]]
          delete adminroomowner[id]
          socket.to("lobby").emit("sendroomlist", roomlist)
      } else if(playerrooms.hasOwnProperty(id)){
        if(playerlist.hasOwnProperty(playerrooms[id]["room"])){
          if(playerlist[playerrooms[id]["room"]].hasOwnProperty(id)){
            delete playerlist[playerrooms[id]["room"]][id]
            socket.to(playerrooms[id]["room"]).emit("donegetlist")
            delete playerrooms[id]
          }
        }
       
        
      }
      
    })

  })
}

module.exports = socket;
