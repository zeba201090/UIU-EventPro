const express = require("express");
const dotenv = require("dotenv");
const { start } = require("./db_conn");
const session = require('express-session');

const ejs = require("ejs");
const app = express();
start();



const User = require("./models/model_schemaa");
const Room = require("./models/room_schema");
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
app.use(session({
  secret: '1234', 
  resave: false,
  saveUninitialized: false
}));
// Connect to DB
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Signup/index.html");
});

function requireLogin(req, res, next) {
  if (req.session.loggedIn) {
    next(); // User is authenticated, proceed to the next middleware/route handler
  } else {
    res.redirect('/'); // User is not logged in, redirect to the login page
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
  
  console.log(email_db);
  if (pass === pass_db) {
    req.session.loggedIn = true;
    req.session.userId = User._id;
    // res.send("Successfully logged in");
    res.render("homepage", { name: email_db.firstName });
   
  } else {
    res.send("password not matching");
  }
});

app.post("/rooms",requireLogin , async (req, res) => {
  const { roomName, roomNumber, roomType, capacity, openDays, availableTime } =
    req.body;
  console.log(roomName);

  const room = new Room({
    roomName: roomName,
    roomNumber: roomNumber,
    roomType: roomType,
    capacity: capacity,
    booking: false,
    openDays: openDays,
    availableTime: availableTime,
  });

  const savedRoom = await room.save();

  res.send(savedRoom);
});

app.get("/book",requireLogin, async (req, res) => { 
  res.render("book")
;});


app.post('/bookroom',requireLogin , async(req, res) => {
  const selectedRoomType = req.body.roomType; // Retrieve the selected room type from the form
   let data =[];

      data = await Room.find({ roomType: selectedRoomType });
      const rooms= data.length;
      res.render('rooms', { rooms: data,roomLength:rooms ,roomType:selectedRoomType});

    
});
app.post('/booking', async(req, res) => {
  const roomId = req.body.selectedRoom;
  console.log("Selected Room Number:", roomId);
  // Room.update({ roomNumber: selectedRoom }, { $set: { booking: true } });
  const updatedRoom = await Room.findOneAndUpdate(
    { _id: roomId },
    { $set: { booking: true }})

  res.send("Room Booked Successfully");
});

app.get('/logout', (req, res) => {
  // Clear the session data
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/'); // Redirect to the login page after logout
  });
});


