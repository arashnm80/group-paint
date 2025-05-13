const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Store drawing history
let drawingHistory = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
    // Send existing drawing history to new clients
    socket.emit('drawingHistory', drawingHistory);

    // Handle new drawing events
    socket.on('draw', (drawData) => {
        drawingHistory.push(drawData);
        socket.broadcast.emit('draw', drawData);
    });

    // Handle canvas clear event
    socket.on('clearCanvas', () => {
        drawingHistory = [];
        socket.broadcast.emit('clearCanvas');
    });
});

server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});
