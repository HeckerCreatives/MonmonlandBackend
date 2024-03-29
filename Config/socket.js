const express = require("express");
const app = express();
const path = require('path');
const UpgradeSubscription = require('../Models/UpgradeSubscription');
const User = require('../Models/Users');

const socket = io => {
  const roomMessages = {};
  const roomlist = {};
  const adminroomowner = {};
  const playerrooms = {};
  const playerlist = {}; // si queueing
  let __createdtime__ = Date.now();
  app.use(require('express').static(path.join(__dirname, 'public')));
  io.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    function getQueNumber(roomname, username, oldsocket){
      let queuePosition;
      
      if(oldsocket !== undefined && oldsocket !== null){
        queuePosition = playerlist[roomname].findIndex((object) => oldsocket in object)

        if(queuePosition === 0){
          let olddata = playerlist[roomname][queuePosition]
          let newdata = {}
          let newplayerlist = {}
          newplayerlist[roomname] = playerlist[roomname]
          newdata[username] = olddata[oldsocket]
          newplayerlist[roomname].shift()
          newplayerlist[roomname].unshift(newdata)
          playerlist[roomname] = newplayerlist[roomname]
        } else {
          let olddata = playerlist[roomname][queuePosition]
          let newdata = {}
          let newplayerlist = {}
          newplayerlist[roomname] = playerlist[roomname]
          newdata[username] = olddata[oldsocket]
          if(queuePosition == -1){
            playerlist[roomname].splice(queuePosition, 1);
            socket.emit("forcekick")
            return
          }
           // Use splice to remove the element to delete
          playerlist[roomname].splice(queuePosition, 1);
          // Use splice again to add the new element at the specified index
          playerlist[roomname].splice(queuePosition, 0, newdata);
          console.log(playerlist[roomname])
          
        }
        
      } else {
        queuePosition = playerlist[roomname].findIndex((object) => username in object)
      }

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
      const { roomid, playfabid, username, transaction, reconnect, oldsocket, isplayer } = data;
      User.findOne({userName: username})
      .then(data => {
        if(!isplayer){
          if(data){
            if(data.roleId.toString() === process.env.subadminrole || data.roleId.toString() === process.env.csrrole){
              UpgradeSubscription.find({userId: data._id})
              .populate({
                path: "userId",
                select: "-password -token"
              })
              .then((cashier) => {
                const item = cashier.filter(item => !item.deletedAt)
                roomlist[roomid] = {
                  id: socket.id,
                  user: username, 
                  item,
                }
                adminroomowner[socket.id] = {roomid: roomid}
                playerlist[roomid] = []
                socket.join(roomid);
                socket.to("lobby").emit("sendroomlist", roomlist)
              })
              
            }
          }
        } else {
          if(!reconnect){
            let list = [];
            let newItem = {}

            if(!playerlist.hasOwnProperty(roomid)){
              socket.emit("forcekick")
              return
            }

            if(Object.keys(playerlist[roomid]).length !== 0){
              list = playerlist[roomid]
            }
            
            newItem[socket.id] = {
              id: socket.id,
              username,
              playfabid,
              transaction,
            }

            list.push(newItem)

            // Push the 'listArray' into 'playerlist[roomid]'.
            playerlist[roomid] = list;
            playerrooms[socket.id] = {room: roomid}
            socket.to(roomlist[roomid].id).emit("playersinline", playerlist[roomid])
          } else {
            if(!roomlist.hasOwnProperty(roomid)){
              socket.emit("forcekick")
              return
            }
            
           const queuePosition = playerlist[roomid].findIndex((object) => oldsocket in object)
           if(queuePosition <= -1){
            socket.emit("forcekick")
            return
           }
          }
          socket.join(roomid)
          getQueNumber(roomid, socket.id, oldsocket);
        }

      })

    });

    socket.on("usersinline", (data) => {
      const { room } = data;
      socket.to(roomlist[room].id).emit("playersinline", playerlist[room])
      console.log(playerlist[room])
    })


    socket.on("refreshcashierdata", () => {
      // console.log(data)
      // roomlist[adminroomowner[socket.id]["roomid"]].item[0].numberoftransaction = data.numberoftransaction;
      // roomlist[adminroomowner[socket.id]["roomid"]].item[0].paymentcollected = data.paymentcollected;
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
      socket.to(roomlist[room].id).emit("playerdetails", playerlist[room][0][socket.id])
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

    socket.on("admin_send_message", (data) => {
      const { image, message, username, room, _createdtime_, usersocket } = data;
      socket.emit("receive_message", data)
      
      if(Object.keys(playerlist[room][0])[0] !== null || Object.keys(playerlist[room][0])[0] !== undefined){
        socket.to(Object.keys(playerlist[room][0])[0]).emit("receive_message", data)
      }
    })

    socket.on("doneTransactionAdmin", (data) => {
      const { room, buyer } = data;
      if(Object.keys(playerlist[room][0])[0]){
        socket.to(Object.keys(playerlist[room][0])[0]).emit("kicked")
      }
      

      playerlist[room].shift()
      delete playerrooms[buyer]
      
      socket.to(room).emit("donegetlist")
      socket.emit("deletemsg")
    })

    socket.on("doneTransactionUser", (data) => {
      const {roomId} = data

      socket.emit("kicked")
      playerlist[roomId].shift()
      
    })

    socket.on("refreshque", (data) => {
      const {room } = data
      getQueNumber(room, socket.id);
      socket.to(roomlist[room].id).emit("playersinline", playerlist[room])
    })

    socket.on('selectsubs', (data) => {
      const {room, subs} = data
      socket.to(Object.keys(playerlist[room][0])[0]).emit('badge', {item: subs})
    })

    socket.on("cancelTransactionAdmin", (data) => {
      const { room, buyer } = data;
      socket.to(Object.keys(playerlist[room][0])[0]).emit("canceled")
      
      playerlist[room].shift()
      delete playerrooms[buyer]
      
      socket.to(room).emit("donegetlist")

    })

    socket.on("cancelTransactionUser", () => {
      socket.to(roomlist[playerrooms[socket.id]["room"]].id).emit("canceleduser", playerlist[playerrooms[socket.id]["room"]][0][socket.id])

      playerlist[playerrooms[socket.id]["room"]][0][socket.id].shift()
      // delete playerlist[playerrooms[socket.id]["room"]][0][socket.id]
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
      }
      //  else if(playerrooms.hasOwnProperty(id)){
      //   if(playerlist.hasOwnProperty(playerrooms[id]["room"])){
      //     if(playerlist[playerrooms[id]["room"]].hasOwnProperty(id)){
      //       socket.to(roomlist[playerrooms[id]["room"]].id).emit("adminrefreshlist", playerlist[playerrooms[id]["room"]][id])
      //       delete playerlist[playerrooms[id]["room"]][id]
      //       socket.to(playerrooms[id]["room"]).emit("donegetlist")
            
      //       delete playerrooms[id]
      //     }
      //   }
      // }
      
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
      } 
      // else if(playerrooms.hasOwnProperty(id)){
      //   if(playerlist.hasOwnProperty(playerrooms[id]["room"])){
      //     if(playerlist[playerrooms[id]["room"]].hasOwnProperty(id)){
      //       delete playerlist[playerrooms[id]["room"]][id]
      //       socket.to(playerrooms[id]["room"]).emit("donegetlist")
      //       delete playerrooms[id]
      //     }
      //   }
       
        
      // }
      
    })

    socket.on("leaveroom", (data) => {
      const {currentsocket, room} = data
      queuePosition = playerlist[room].findIndex((object) => currentsocket in object)
      playerlist[room].splice(queuePosition, 1);
      socket.to(room).emit("donegetlist")
      socket.emit("cancelque")
     
    })

  })
}

module.exports = socket;
