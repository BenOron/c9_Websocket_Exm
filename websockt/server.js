// var async = require('async');

var path = require('path');
var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

app.use(express.static(path.resolve(__dirname, 'client')));

io.sockets.on('connection', function(socket){
  
  var userID = Math.round(Math.random() * (2 - 1) + 1);
  console.log('UserID is ' + userID + '.');
  
  socket.join('room' + userID);
  
  socket.on('connect_to_other', function(msg){
    var otherUserID = msg.otherUserID;
 
    socket.join('room' + userID + 'to' + msg.otherUserID);
    console.log('room' + userID + 'to' + msg.otherUserID);
    
    //after joining userID+otherUserID room emit signal to client for action (unhide chat window)
    socket.emit('open chat window', {success : true, otherUserID : otherUserID});

    //then send signal to other user for a bounceback emit of join 'request user room'. passes userID
    io.sockets.to('room' + otherUserID).emit('call to join', userID);

    //sender
    socket.on('chat message', function(msg){
      console.log(msg);

      io.sockets.to('room' + userID + 'to' + otherUserID).emit('chat message', {userID : userID, msg : msg});
    }); 
   
  });
  
  //listening for client for call to join room initiated by chat requester.  'msg' is requesting user ID
  socket.on('join request user room', function(msg){
    console.log(userID + ' receiving request from user' + msg);
    
    var otherUserID = msg;
    socket.join('room' + msg + 'to' + userID);
    console.log('room' + msg + 'to' + userID);
    
    //after joining userID+otherUserID room emit signal to client for action (unhide chat window)
    socket.emit('open chat window', {success : true, otherUserID : otherUserID});
    
    //receiver
    socket.on('chat message', function(msg){
      console.log(msg);
      
      io.sockets.to('room' + otherUserID + 'to' + userID).emit('chat message', {userID : userID, msg : msg});
    }); 
  });
    
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  
  
 //reset
  // var randomNum = Math.round(Math.random() * (2 - 1) + 1);
  
  // console.log('user connected to room: ' + randomNum);
    
  // socket.join('room' + randomNum);
    
  // socket.on('chat message', function(msg){
  //   io.sockets.to('room' + randomNum).emit('chat message', msg);
  // });
    
  // socket.on('disconnect', function(){
  //   console.log('user disconnected');
  // });
});

http.listen(process.env.PORT || 3000, function(){
    console.log('connected to port: ' + process.env.PORT);
});

/*
*
* ALLOWS FOR SPECIFIC USER TO USER CONNECTION W/O USING NATIVE SOCKET.IO JOIN METHOD
*
*/

// var users goes before io.sockets.on('connection')!!!!!!!!!!!
// var users = {};

// var randomNum = Math.round(Math.random() * (2 - 1) + 1);
  
//   console.log('user connected to room: ' + randomNum);
 
//   if (!users['Room'+randomNum]) users['Room'+randomNum] = [];
  
//   users['Room'+randomNum].push(socket);
 
//   socket.on('chat message', function(msg){
//     for (x in users['Room'+randomNum]) {
//       users['Room'+randomNum][x].emit('chat message', msg);
//     }
//   });
    
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });


  
