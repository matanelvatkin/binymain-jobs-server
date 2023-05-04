const nodemailer = require('nodemailer');


async function sendMail(email, subject, html) {
    try {
      const transporter = await nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "hereevent1@gmail.com",
          pass: "jeelwvaploojnari"
        }
      });
      const mailOptions = await {
        from: 'hereevent1@gmail.com',
        to: email,
        subject: subject,
        html: html
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  
    } catch (error) {
      throw { message: "something went wrong" }
  
    }
  
  }

  module.exports = {
    sendMail
  };
  