const userController = require("../DL/user.controller");
const nodemailer = require('nodemailer');



async function createUser(newUserData) {
  const newUser = await userController.create(newUserData);
  return {
    status: "success",
    newUser: newUser,
  };
}

async function findUser(user) {
  const foundUser = await userController.find(user);
  return foundUser;
}

async function forgetPassword(email, code) {
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
      subject: 'Forgot Password',
      text: `Code to reset the password ${code}`
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
  createUser,
  findUser,
  forgetPassword,
}