const nodemailer = require('nodemailer');
const ejs = require('ejs');

const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'jsnode741@gmail.com',
      pass: 'pxkcamdnlblsqoqh'
    }
  
});

const sendEmail = (receiver, subject, content) => {
  ejs.renderFile(__dirname + '/views/welcome.ejs', { receiver, content }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      var mailOptions = {
        from: 'jsnode741@gmail.com',
        
        to: receiver,
        subject: subject,
        html: data
      };

      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
      });
    }
  });
};

module.exports = {
  sendEmail
};