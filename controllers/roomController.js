const Room = require("../models/room_schema");
const Event = require("../models/event_schema");
const { name } = require("ejs");

async function createRoom(req, res) {
  try {
    const { roomName, roomNumber, roomType, capacity, booking_fee } = req.body;
    const days = req.body.checkbox || [];
    const availableTime = req.body.myArray.split(",") || [];

    const room = new Room({
      roomName,
      roomNumber,
      roomType,
      capacity,
      booking: false,
      openDays: days,
      availableTime,
      fee: booking_fee,
    });

    const savedRoom = await room.save();

    res.send(savedRoom);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating room");
  }
}

async function getAvailableDays(req, res) {
  const days = req.body.checkbox;
  res.send(days);
}

function renderBookPage(req, res) {
  res.render("book");
}

async function renderRooms(req, res) {
  try {
    const { eventName, eventOrganizer, eventEmail, eventPhone, eventType,Ticketprice } = req.body;
    const { roomType, dates } = req.body;
    const dateArray = dates.split(",");

    const data = await Room.find({ roomType });
    const rooms = data.length;
    res.render("roomSlotSelect", {
      rooms: data,
      roomLength: rooms,
      capacity: data.capacity,
      roomType,
      availableTime: data.availableTime,
      bookedSlots: data.bookedSlots,
      dates: dateArray,
      eventName,
      eventOrganizer,
      eventEmail,
      eventPhone,
      eventType,
      feee: data.fee,
      Ticketprice
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error rendering rooms");
  }
}

async function bookRoom(req, res) {
  try {
    const { eventName, eventOrganizer, eventEmail, eventPhone, eventType, selectedRoom, dates, bookedSlots,fee,Ticketprice } = req.body;
    // const { selectedRoom, dates, bookedSlots } = req.body;

    const room = await Room.findById(selectedRoom);

    if (!room) {
      return res.status(404).send("Room not found");
    }

    let bookingArray = [];
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const slotsArray = bookedSlots[selectedRoom][i];
      bookingArray.push({ date, times: slotsArray, room });
      room.bookedSlots.push({ date, times: slotsArray });
    }
    const newEvent = new Event({
      eventName,
      eventOrganizer,
      eventEmail,
      eventPhone,
      eventType,
      bookedSlots: bookingArray,
      Ticketprice
    });
    newEvent.save();
    res.render("bookingSummary", {
      room: selectedRoom,
      bookingArray: Object.values(bookingArray),
      eventName,
      eventOrganizer,
      eventEmail,
      eventPhone,
      eventType,
      fee
    });

    
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
}

async function confirmBooking(req, res) {
   try {
    const { eventName, eventOrganizer, eventEmail, eventPhone, eventType,totalFee } = req.body;
    const queryString = `eventName=${eventName}&eventOrganizer=${eventOrganizer}&eventEmail=${eventEmail}&eventPhone=${eventPhone}&eventType=${eventType} &amount=${totalFee}`;

    console.log(queryString);

    res.redirect(`/init?${queryString}`);

  }
   catch (error) {
    console.error(error);
    res.send("Error");
  }
}


async function viewEvents(req, res) {
  try {
    const events = await Event.find();
    res.render("viewEvents", { events });
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
}

async function userEvents(req, res) {
  try {
    const events = await Event.find().sort({$natural:-1});
    res.render("events_User", { events });
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
}

async function processSlots(req, res) {
  const receivedArray = req.body.myArray.split(",");
  res.send("Array received successfully");
}

function submitDates(req, res) {
  const { eventName, eventOrganizer, eventEmail, eventPhone, eventType,Ticketprice } = req.body;
  const selectedDates = req.body.dates;
  console.log(selectedDates);
  res.render('book', { date: selectedDates, eventName, eventOrganizer, eventEmail, eventPhone, eventType,Ticketprice });
}

async function searchEvent(req, res) {
  const  eventName  = req.body.search;
  const events = await Event.find({$text: { $search: eventName }});
  console.log(req.body.search);
  res.render('viewEvents', { events });
}
async function searchEvent_user(req, res) {
  const  eventName  = req.body.search;
  const events = await Event.find({$text: { $search: eventName }});
  console.log(req.body.search);
  res.render('events_User', { events });
}
async function latestEvent(req, res) {
  const events = await Event.find().sort({$natural:-1}).limit(3);
  console.log(events);
  res.render('latestEvent', { events });
}

async function allRooms(req, res) {
  const rooms = await Room.find();

  res.render('allRooms', { rooms });
}

async function book_Event(req, res) {

  console.log('hi i am hit');
    res.render('book_Event');
}
async function add_room_page(req, res) {

  console.log('hi ');
    res.render('addRoom_page');
}

async function viewBookedSlots(req, res) {
  try {
    const roomId = req.body.roomId;

    const rooms = await Room.findById(roomId);

    if (!rooms) {
      return res.status(404).send("Room not found");
    }

    res.render('viewBookedSlots', { rooms });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
}
async function totalSales(req, res) {
  try {
    const roomId = req.body.roomId || req.query.roomId;

      const page = parseInt(req.query.page) || 1;
      const page_limit = 10;
      const skip = (page - 1) * page_limit;

      const rooms = await Room.findById(roomId)
        .populate({
          path: 'bookedSlots',
          options: {
            skip: skip,
            limit: page_limit
    }
  });

    res.render('totalSales', { rooms });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
}

async function bookTicket (req,res) {
  

}


module.exports = {
  createRoom,
  getAvailableDays,
  renderBookPage,
  renderRooms,
  bookRoom,
  processSlots,
  submitDates,
  confirmBooking,
  viewEvents,
  searchEvent,
  latestEvent,
  book_Event,
  add_room_page, 
  allRooms,
  viewBookedSlots,
  totalSales,
  userEvents,
  searchEvent_user

}
