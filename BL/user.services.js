const userController = require("../DL/user.controller");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')



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
  const subject = 'Forget Password'
  const html = `
    <div dir="RTL" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>איפוס סיסמא</h1>
      <p>Dear ${email},</p>
      <p>קיבלנו את בקשתך לאפס את הסיסמה לחשבון שלך..</p>
      <h2>קוד איפוס הסיסמה שלך הוא:${code}</h2>
      <p>לאפס את הקוד אנא הזן קוד זה בטופס איפוס הסיסמה כדי להגדיר סיסמה חדשה.</p>
      <p>אם לא ביקשת איפוס סיסמה, אנא התעלם מאימייל זה.</p>
      <p>,תודה</p>
      <p> HereEvent </p>
    </div>`
  await sendMail(email, subject, html)

}

async function sendEventDetailsToAdvertiser(email, eventDate) {
  const {eventName,advertiser,date,beginningTime,finishTime,place} = eventDate;
  const subject = 'פורסם אירוע חדש - hereEvent'
  const html = `
  <div dir="RTL" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
   <h1>פרטי אירוע חדש</h1>
    <p>אירוע חדש פורסם על ידך:</p>
    <ul>
    <li>שם האירוע: ${eventName}</li>
      <li>מפרסם ${advertiser}</li>
      <li>תאריך האירוע: ${date}</li>
      <li>שעות האירוע: ${beginningTime}-${finishTime}</li>
      <li>מיקום האירוע: ${place}</li>
      <li>  <a href="https://www.youtube.com/">שינוי פרטי האירוע</a> </li>
     
    </ul>
  </div>`
  await sendMail(email, subject, html)

}

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

async function updateUser(data) {
  const { email, newData } = data;
  return await userDL.update(email, newData);
}

async function changePassword(email, newPassword) {
  try {
    const pass = bcrypt.hashSync(newPassword, 10)
    updateUser({ email: email, newData: { password: pass } })
  } catch (error) {
    throw { message: error.message }
  }
}

module.exports = {
  createUser,
  findUser,
  forgetPassword,
  changePassword
}