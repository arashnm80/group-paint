const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let sharedText = ''; // Shared state

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.emit('init', sharedText);

    socket.on('textUpdate', (newText) => {
        sharedText = newText;
        socket.broadcast.emit('textUpdate', newText);
    });
});

server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
});
