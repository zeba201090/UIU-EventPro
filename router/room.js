// const express = require('express')
// const router = express.Router()
// const Room = require('../models/room_schema')
// console.log('hi');
// const createRoom = require('../Controller/room')

// router.post('/rooms', createRoom)

// module.exports = router

const express = require('express');
const router = express.Router();

// Define routes for room-related operations
router.post('/rooms', (req, res) => {
  // Handle the room route
  res.send('Room created');
});

module.exports = router;