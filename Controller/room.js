const express = require('express');
const router = express.Router();

// const createRoom = async (req, res) => {

//     res.send('hello');
//     // const { roomName, roomNumber, roomType, capacity, availableTime } = req.body;
//     // const checkedValues = req.body.checkboxes || [];
//     // console.log('hello');
//     // console.log(checkedValues); 
    
  
//     // const room = new Room({
//     //   roomName: roomName,
//     //   roomNumber: roomNumber,
//     //   roomType: roomType,
//     //   capacity: capacity,
//     //   booking: false,
//     //   openDays: days,
//     //   availableTime: availableTime,
//     // });
  
//     // const savedRoom = await room.save();
  
//     // res.send(savedRoom);
//   };

router.post('/', (req, res) => {
  // Handle the room creation route
  res.send('Room created');
});
  module.exports = createRoom;

  