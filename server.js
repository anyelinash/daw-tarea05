const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const users = {};

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
        const disconnectedUser = users[socket.id];
        delete users[socket.id];
        io.emit('user_disconnected', disconnectedUser);
    });

    socket.on('new_user', (username) => {
        users[socket.id] = username;
        io.emit('user_connected', username);
    });

    socket.on('chat_message', (data) => {
        io.emit('chat_message', data);
    });
});

server.listen(3000, () => {
    console.log('Server corriendo en http://localhost:3000');
});
