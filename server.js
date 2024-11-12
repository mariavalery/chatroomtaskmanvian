const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const activeUsers = {}; // Store users by room

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', ({ name, room }) => {
    socket.join(room);
    activeUsers[socket.id] = { name, room };
    
    // Broadcast to the room that a new user has joined
    socket.to(room).emit('message', `${name} has joined the room.`);
    
    // Update active users in the room
    const usersInRoom = Object.values(activeUsers)
      .filter(user => user.room === room)
      .map(user => user.name);
    io.to(room).emit('activeUsers', usersInRoom); // Send updated users list to the room
  });

  socket.on('chatMessage', ({ name, room, message }) => {
    io.to(room).emit('message', `${name}: ${message}`); // Send message to everyone in the room
  });

  socket.on('disconnect', () => {
    const user = activeUsers[socket.id];
    if (user) {
      const { name, room } = user;
      delete activeUsers[socket.id];

      // Notify users in the room that a user has left
      socket.to(room).emit('message', `${name} has left the room.`);
      
      // Update the list of active users in the room
      const usersInRoom = Object.values(activeUsers)
        .filter(user => user.room === room)
        .map(user => user.name);
      io.to(room).emit('activeUsers', usersInRoom);
    }
    console.log('A user disconnected');
  });
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
