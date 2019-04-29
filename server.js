// Much thats to Daniel Shiffman for the p5.js pong mechanics
var express = require('express');
const fs = require('fs') 

var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

// read highScore.txt
var highScore = 0;
fs.readFile('highScore.txt', (err, data) => { 
    if (err) throw err; 
    highScore = Number(data);
    console.log(highScore);
}); 

app.use(express.static('public'));

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
  
    console.log("We have a new client: " + socket.id);
  
    // Recieve data from clients
    socket.on('mouse1', function(data) {
      // Data comes in as whatever was sent, including objects
      console.log("Received mouse data from client: " + data.x + " " + data.y);
    
      // Send it to all other clients
      socket.broadcast.emit('mouse1', data);
    });

    // Recieve data from clients
    socket.on('mouse2', function(data) {
      console.log("Received mouse data from client: " + data.x + " " + data.y);
        
      socket.broadcast.emit('mouse2', data);
    });

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });

    // reset sketch on "new game" click
    socket.on('resetSketch', function(data) {
      console.log("SERVER.js sketch has been reset: " + data);
      socket.broadcast.emit('resetSketch', data);
    });

    // send scores to be displayed on client screen
    socket.on('clientScore', function(data) {
      socket.broadcast.emit('yourScore', data);
    });

    // send high score data
    socket.emit('sendHighScore', highScore);

    // reset high score
    socket.on('resetHighHitScore', function(data) {
      console.log("new high score = " + data);
      newHighScore = data;
  
      // write new high score to text file (mini database)
      fs.writeFile('highScore.txt', newHighScore, (err) => { 
          if (err) throw err; 
      })

      highScore = newHighScore;
      socket.emit('sendHighScore', highScore);
    });

    // socket.on('gyroData', function(data) {
    //     console.log("gyro data is: " + data);
    // });

  }
);


