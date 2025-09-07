// middleware/socketAuth.js
const jwt = require('jsonwebtoken');

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
};

module.exports = socketAuth;
