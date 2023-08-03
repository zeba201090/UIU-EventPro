const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const path = require("path");
const ejs = require("ejs");
const app = express();

const SSLCommerzPayment = require('sslcommerz-lts')
const store_id = 'uiuev64c807f0af33c'
const store_passwd = 'uiuev64c807f0af33c@ssl'
const is_live = false //true for live, false for sandbox


const { start } = require("./db_conn.js");
start();
dotenv.config();

// Import Controllers
const indexController = require("./controllers/indexController");
const userController = require("./controllers/userController");
const roomController = require("./controllers/roomController");
const liveController = require('./controllers/liveController');
const viewerController = require('./controllers/viewerController'); 


//  middleware
app.use(express.static('Public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "1234",
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");

// Routes
app.get("/", indexController.index);
app.post("/submit", userController.register);
app.post("/login", userController.login);
app.post("/rooms", roomController.createRoom);
app.post("/avl", roomController.getAvailableDays);
app.get("/book", roomController.renderBookPage);
app.post("/bookroom", roomController.renderRooms);
app.post("/booking", roomController.bookRoom);
app.post("/slot", roomController.processSlots);
app.post("/submit-dates", roomController.submitDates);
app.post("/booking-confirm", roomController.confirmBooking);
app.get("/viewEvents", roomController.viewEvents);
app.get("/logout", userController.logout);
app.post("/send-eemail", userController.sendEmail);
app.use('/live', liveController);
app.use('/view', viewerController); 

app.get('/init',userController.payment);
app.post('/confirmation_page',userController.confirmation_page);


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});