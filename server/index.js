const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Message Model
const Message = require('./models/Message');

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Join room
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    try {
      const message = new Message({
        user: data.user,
        text: data.text,
        room: data.room,
      });

      await message.save();

      // Emit to all users in the room
      io.to(data.room).emit('message', {
        user: message.user,
        text: message.text,
        timestamp: message.timestamp,
        _id: message._id,
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API Routes
app.get('/api/messages/:room', async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room })
      .sort({ timestamp: 1 })
      .limit(50);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
