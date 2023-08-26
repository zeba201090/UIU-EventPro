// userController.js
const User = require("../models/model_schemaa");
const Event = require("../models/event_schema");
const { start } = require("../db_conn.js");
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = "uiuev64c807f0af33c";
const store_passwd = "uiuev64c807f0af33c@ssl";
const is_live = false; //true for live, false for sandbox

async function register(req, res) {
  const { fname, lname, email, password, cpassword } = req.body;
  if (password === cpassword) {
    try {
      const user = new User({
        firstName: fname,
        lastName: lname,
        email,
        password,
      });
      const data = await user.save();
      res.send("Successfully registered");

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send("Password not matching");
  }
}

async function login(req, res) {
  const { loginpassword, username } = req.body ;

  const email_db = await User.findOne({ email: username });
  const pass_db = email_db.password;
  const events = await Event.find().sort({ $natural: 1 }).limit(3);
  
  if (loginpassword === pass_db) {
    req.session.loggedIn = true;
    req.session.userId = User._id;
    res.render("index", { name: email_db.firstName, events });
  } else {
    res.send("Password not matching");
  }
}
async function homepage(req, res) {

  const events = await Event.find().sort({ $natural: 1 }).limit(3);
  res.render("index", { events });
}


function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/");
  });
}

// ...
const nodemailer = require("nodemailer");

function sendEmail(req, res) {
  
  const { eventName, eventOrganizer, eventEmail, eventPhone, eventType } = req.query;
  const bookingArray = req.query.bookingArray;
  console.log(bookingArray);
  console.log(eventName);
  console.log("Sending email...");
  // Create a transporter object with your email service provider's SMTP configuration
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "jsnode741@gmail.com",
      pass: "pxkcamdnlblsqoqh",
    },
  });

  // Define the email options
  const mailOptions = {
    from: "jsnode741@gmail.com",
    to: "mzeba16@gmail.com",
    subject: "Welcome to our app!",
    html: "<h1>Welcome to our app!</h1>",
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sssssssending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.send("Email sent successfully");
    }
  });
}
async function confirmation_page(req, res) {
  try {
    console.log("Confirmation page...");

    const { eventName, eventOrganizer, eventEmail, eventPhone, eventType } =
      req.query;

    // const bookedSlotsData = [];

    // for (const bookingData of bookingArray) {
    //   const { date, times, room } = bookingData;

    //   bookedSlotsData.push({
    //     date,
    //     times,
    //     room,
    //   });
    // }

    // const createEvent = new Event({
    //   eventName,
    //   eventOrganizer,
    //   eventEmail,
    //   eventPhone,
    //   eventType,
    //   bookedSlots: bookedSlotsData,
    // });
    // const savedEvent = await Event.create(createEvent);

    res.render("success");
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
}

async function payment(req, res) {
  console.log("Payment initiated...");

  const amount = req.query.amount;
  const eventName = req.query.eventName;
  const eventOrganizer = req.query.eventOrganizer;
  const eventEmail = req.query.eventEmail;
  const eventPhone = req.query.eventPhone;
  const eventType = req.query.eventType;


  const data = {
    total_amount: amount,
    currency: "BDT",
    tran_id: "REF123", // use unique tran_id for each api call
    success_url: "http://localhost:3000/test",
    fail_url: "http://localhost:3000/fail",
    cancel_url: "http://localhost:3000/cancel",
    ipn_url: "http://localhost:3000/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const successURLWithBookingInfo = `http://localhost:3000/test?eventName=${eventName}&eventOrganizer=${eventOrganizer}&eventEmail=${eventEmail}&eventPhone=${eventPhone}&eventType=${eventType}&amount=${amount}`;
  console.log(successURLWithBookingInfo);
  data.success_url = successURLWithBookingInfo;
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then((apiResponse) => {
    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL;
    res.redirect(GatewayPageURL);
    console.log("Redirecting to: ", GatewayPageURL);
  });
}

async function successTicket(req, res) {
  console.log("Payment initiated...");
  const { eventName, eventOrganizer,TicketPrice,eventPhone, name } =
      req.body;
  

  const data = {
    total_amount: TicketPrice,
    currency: "BDT",
    tran_id: "REF123", // use unique tran_id for each api call
    success_url: "http://localhost:3000/test",
    fail_url: "http://localhost:3000/fail",
    cancel_url: "http://localhost:3000/cancel",
    ipn_url: "http://localhost:3000/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const successURLWithBookingInfo = `http://localhost:3000/test?eventName=${eventName}&eventOrganizer=${eventOrganizer}&eventEmail=${eventEmail}&eventPhone=${eventPhone}&eventType=${eventType}&amount=${amount}`;

  console.log(successURLWithBookingInfo);
  data.success_url = successURLWithBookingInfo;
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then((apiResponse) => {
    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL;
    res.redirect(GatewayPageURL);
    console.log("Redirecting to: ", GatewayPageURL);
  });
}

async function bookTicket (req, res) {
  try {
    console.log("Confirmation page...");

    const { eventName, eventOrganizer,TicketPrice,eventPhone, name } =
      req.body;

    res.render("successTicket", {eventName, eventOrganizer,  eventPhone, TicketPrice,name} );
    // const bookedSlotsData = [];

    // for (const bookingData of bookingArray) {
    //   const { date, times, room } = bookingData;

    //   bookedSlotsData.push({
    //     date,
    //     times,
    //     room,
    //   });
    // }

    // const createEvent = new Event({
    //   eventName,
    //   eventOrganizer,
    //   eventEmail,
    //   eventPhone,
    //   eventType,
    //   bookedSlots: bookedSlotsData,
    // });
    // const savedEvent = await Event.create(createEvent);

    res.render("success");
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
}

module.exports = {
  register,
  login,
  logout,
  sendEmail,
  payment,
  confirmation_page,
  homepage,
  bookTicket,
  successTicket

};
