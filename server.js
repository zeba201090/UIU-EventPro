const express = require("express");
const dotenv = require("dotenv");
const { start } = require("./db_conn");
const session = require("express-session");
const path = require("path");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const fs = require("fs");


const app = express();
start();
app.use(express.static('Public'));


const User = require("./models/model_schemaa");
const Room = require("./models/room_schema");
dotenv.config();
app.use(
  "/select.css",
  express.static(path.join(__dirname, "Public/select.css"))
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
app.use(
  session({
    secret: "1234",
    resave: false,
    saveUninitialized: false,
  })
);

const createRoomm = require("./router/room");

// Connect to DB
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Signup/index.html");
});

function requireLogin(req, res, next) {
  if (req.session.loggedIn) {
    next(); // User is authenticated, proceed to the next middleware/route handler
  } else {
    res.redirect("/"); // User is not logged in, redirect to the login page
  }
}

app.post("/submit", async (req, res) => {
  const pass = req.body.password;
  const cpass = req.body.cpassword;
  if (pass === cpass) {
    try {
      const user = new User({
        firstName: req.body.fname,
        lastName: req.body.lname,
        email: req.body.email,
        password: req.body.password,
      });
      const data = await user.save();
      res.send("Successfully registered");

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send("password not matching");
  }
});

app.post("/login", async (req, res) => {
  const pass = req.body.loginpassword;
  const email_ = req.body.username;

  const email_db = await User.findOne({ email: email_ });
  const pass_db = email_db.password;

  if (pass === pass_db) {
    req.session.loggedIn = true;
    req.session.userId = User._id;
    // res.send("Successfully logged in");
    res.render("homepage", { name: email_db.firstName });
  } else {
    res.send("password not matching");
  }
});

app.post("/rooms", async (req, res) => {
  const { roomName, roomNumber, roomType, capacity } = req.body;
  let days = [];

  days = req.body.checkbox || [];
  const availableTime = req.body.myArray.split(",") || [];
  console.log(availableTime);

  const room = new Room({
    roomName: roomName,
    roomNumber: roomNumber,
    roomType: roomType,
    capacity: capacity,
    booking: false,
    openDays: days,
    availableTime: availableTime,
  });

  const savedRoom = await room.save();

  res.send(savedRoom);
});

app.post("/avl", async (req, res) => {
  const days = req.body.checkbox;
  console.log(days);
  res.send(days);
});

app.get("/book",  async (req, res) => {
  res.render("book");
});

app.post("/bookroom",  async (req, res) => {
  const selectedRoomType = req.body.roomType; // Retrieve the selected room type from the form
  let data = [];
  let dates=[];

   dates = req.body.dates;

    const dateArray = dates.split(",");
    console.log("Dates of bookroommm:", dateArray.length);


  data = await Room.find({ roomType: selectedRoomType });
  const rooms = data.length;
  res.render("rooms", {
    rooms: data,
    roomLength: rooms,
    capacity: data.capacity,
    roomType: selectedRoomType,
    availableTime: data.availableTime,
    bookedSlots: data.bookedSlots,
    dates: dateArray,

  });
});





app.post("/booking", async (req, res) => {
  
    let bookingArray = [];
    const roomId = req.body.selectedRoom;
    const dates = req.body.dates;
    const bookedSlots = req.body.bookedSlots;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).send("Room not found");
    }
    try {
    // Iterate over the dates array
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const slotsArray = bookedSlots[roomId][i]; // Retrieve the slots array for the current date

      console.log("Date:", date);
      console.log("Slots Array:", slotsArray);
      bookingArray.push({ date: date, times: slotsArray, room: room });
      // Push the date and slots into the bookedSlots array of the room
      room.bookedSlots.push({ date: date, times: slotsArray });
      
    }
    console.log("Booking Array:", bookingArray);

    const updatedRoom = await room.save();
    res.render("bookingSummary", { room:roomId,
      bookingArray: Object.values(bookingArray),
    })
    //  res.send("Room Booked Successfully");
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
});




app.post("/slot", async (req, res) => {
  const receivedArray = req.body.myArray.split(",");
  console.log("Received array:", receivedArray);

 

  res.send("Array received successfully");
});

app.post('/submit-dates',async (req, res) => {
  const selectedDates = req.body.dates;
  

  console.log(selectedDates);

  res.render("book", { date: selectedDates});
  
  
});

app.get("/createEvent", async (req, res) => {
  res.render("createEvent");
});
  
app.get("/logout", (req, res) => {
  // Clear the session data
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/"); // Redirect to the login page after logout
  });
});


app.get('/download-pdf', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

    await page.setViewport({ width: 1920, height: 1080 });

    const pdf = await page.pdf({
      path: 'bookingSummary.pdf',
      format: 'A4'
    });

    await browser.close();

    const pdfUrl = path.join(__dirname, 'bookingSummary.pdf');

    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length });
    res.sendFile(pdfUrl);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error generating PDF');
  }
});


