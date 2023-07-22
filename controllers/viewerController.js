const express = require('express');
const router = express.Router();
const SimplePeer = require('simple-peer');

// GET /view - Render the viewer template to watch the live stream
router.get('/', (req, res) => {
  res.render('viewer');
});

// Socket.IO instance using the HTTP server instance from app.js
const http = require('http');
const io = require('socket.io')(http);

// Handle viewer signaling
io.on('connection', (viewerSocket) => {
  viewerSocket.on('viewer-signal', (data) => {
    // Receive the signal from the viewer
    // and relay it to the broadcaster
    io.to(data.receiverId).emit('offer-signal', data.signal);
  });
});

module.exports = router;
