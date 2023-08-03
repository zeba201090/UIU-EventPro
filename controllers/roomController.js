const Room = require("../models/room_schema");
const Event = require("../models/event_schema");

async function createRoom(req, res) {
  try {
    const { roomName, roomNumber, roomType, capacity } = req.body;
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
    const { eventName, eventOrganizer, eventEmail, eventPhone, eventType } = req.body;
    const { roomType, dates } = req.body;
    const dateArray = dates.split(",");

    const data = await Room.find({ roomType });
    const rooms = data.length;
    res.render("rooms", {
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error rendering rooms");
  }
}

async function bookRoom(req, res) {
  try {
    const { eventName, eventOrganizer, eventEmail, eventPhone, eventType, selectedRoom, dates, bookedSlots } = req.body;
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

    const updatedRoom = await room.save();
    res.render("bookingSummary", {
      room: selectedRoom,
      bookingArray2: bookingArray,
      bookingArray: Object.values(bookingArray),
      eventName,
      eventOrganizer,
      eventEmail,
      eventPhone,
      eventType,
    });
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
}

async function confirmBooking(req, res) {
  try {
    const bookingArray = JSON.parse(req.body.bookingArray);
    const { eventName, eventOrganizer, eventEmail, eventPhone, eventType } = req.body;

    const bookedSlotsData = [];

    for (const bookingData of bookingArray) {
      const { date, times, room } = bookingData;

      bookedSlotsData.push({
        date,
        times,
        room,
      });
    }

    

    const createEvent = new Event({
      eventName,
      eventOrganizer,
      eventEmail,
      eventPhone,
      eventType,
      bookedSlots: bookedSlotsData,
    });
    const savedEvent = await Event.create(createEvent);

    const queryString = `bookingArray=${bookedSlotsData}&eventName=${eventName}&eventOrganizer=${eventOrganizer}&eventEmail=${eventEmail}&eventPhone=${eventPhone}&eventType=${eventType}`;
    
    res.redirect(`/init?${queryString}`);
  } catch (error) {
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

async function processSlots(req, res) {
  const receivedArray = req.body.myArray.split(",");
  res.send("Array received successfully");
}

function submitDates(req, res) {
  const { eventName, eventOrganizer, eventEmail, eventPhone, eventType } = req.body;
  const selectedDates = req.body.dates;
  console.log(selectedDates);
  res.render('book', { date: selectedDates, eventName, eventOrganizer, eventEmail, eventPhone, eventType });
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
};
