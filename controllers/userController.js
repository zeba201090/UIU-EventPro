// userController.js
const User = require("../models/model_schemaa");
const {start} = require("../db_conn.js");
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
  const { loginpassword, username } = req.body;

  const email_db = await User.findOne({ email: username });
  const pass_db = email_db.password;

  if (loginpassword === pass_db) {
    req.session.loggedIn = true;
    req.session.userId = User._id;
    res.render("homepage", { name: email_db.firstName });
  } else {
    res.send("Password not matching");
  }
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
const nodemailer = require('nodemailer');

function sendEmail(req, res) {
  
    console.log('Sending email...');
  // Create a transporter object with your email service provider's SMTP configuration
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'jsnode741@gmail.com',
      pass: 'pxkcamdnlblsqoqh'
    }
  });

  // Define the email options
  const mailOptions = {
    from: 'jsnode741@gmail.com',
    to: 'mzeba16@gmail.com',
    subject: 'Welcome to our app!',
    html: '<h1>Welcome to our app!</h1>'
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sssssssending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.send('Email sent successfully');
    }
  })
  

}

async function confirmBooking(req, res) {
  const { room, bookingArray } = req.body;
}


module.exports = {
  register,
  login,
  logout,
  sendEmail,
  
};
