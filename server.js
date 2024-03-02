const express = require('express');
const app = express();
const http = require('http').createServer(app);
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/chatApp');

// Define the Message model
const Message = mongoose.model('Message', {
    user: String,
    message: String
});

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname, '/PROJECT'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Socket
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('Connected...');

    // Listen for incoming messages
    socket.on('message', async (msg) => {
        try {
            // Save message to MongoDB
            const message = new Message(msg);
            await message.save();

            // Broadcast the message to all connected clients
            io.emit('message', msg);
        } catch (err) {
            console.error(err);
        }
    });
});
