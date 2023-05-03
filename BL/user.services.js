const userController = require("../DL/user.controller");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')


const jwt = require('jsonwebtoken');

async function createUser(newUserData) {
  const newUser = await userController.create(newUserData);
  return {
    status: "success",
    newUser: newUser,
  };
}

async function findUser(user) {
  const foundUser = await userController.find(user);
  if (foundUser) {
    try {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { user: foundUser, token };
    } catch (err) {
      console.error('Error generating Token:', err);
      return { error: 'Error generating JWT token' };
    }
  } else {
    return { error: 'Invalid credentials' };
  }
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
  const {eventName,summary,advertiser,isReapeated,categories,audiences,registrationPageURL,date,beginningTime,finishTime,place} = eventDate;
  const subject = 'פורסם אירוע חדש - hereEvent'
  const html = `
  <div dir="RTL" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
   <h1>פרטי אירוע חדש</h1>
    <p>אירוע חדש פורסם על ידך:</p>
    <ul>
    <li>שם האירוע: ${eventName}</li>
      <li>מפרסם: ${advertiser.name}</li>
      <li>טלפון: ${advertiser.tel}</li>
      <li>מייל: ${advertiser.email}</li>
      <li>אירוע חוזר: ${isReapeated}</li>
      <li>קטגוריות: ${categories}</li>
      <li>קהל יעד: ${audiences}</li>
      <li>תאריך האירוע: ${date}</li>
      <li>שעות האירוע: ${beginningTime}-${finishTime}</li>
      <li>מיקום האירוע: ${place}</li>
      <li> פרטים נוספים על האירוע: ${summary}</li>
      <li> דף הרשמה לאירוע: <a href=${registrationPageURL}>${registrationPageURL}</a></li>
     
    </ul>
  </div>`
  // <li>  <a href="">שינוי פרטי האירוע</a> </li>

  await sendMail(email, subject, html)

}

// const eventData = {
//   eventName:"hi",
//   summary:"dasasd",
//   advertiser:{name:"abi",tel:"0543",email:"dasda@das"},
//   categories:["asd","das","lll"],
//   audiences:["bbb","bfff","lll"],
//   registrationPageURL:"https://www.youtube.com",
//   date:[10/01/11,12/02/12],
//   beginningTime:"12:00",
//   finishTime:"13:00",
//   place:"zxcvvv"
// }

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

async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded) {
    const email = decoded.email;
    const verifyedUser = await userController.findEmail(email);
    return verifyedUser;
    }
  } catch (err) {
    if(err.name === 'TokenExpiredError'){
    console.error('token not valid', err.name);
    return { error: 'token is expired' }
    }else{
      return err;
    }
  }
}


// async function addFavourite(idEvent, idUser){
// const allFavourites= await userController.readOne({_id:idUser}, "favourites -_id")
// console.log("check", allFavourites)
// const ifFav= (allFavourites.favourites).filter((f)=>f._id==idEvent );
// console.log("isFav", ifFav)
// if(ifFav.length==0){
//   console.log("inside")
//  await userController.update({_id:idUser}, {$push: {favourites:{idEvent}}});
// }
// else{
// await userController.update({_id:idUser},{"favourites.id":idEvent},{
//   $set:{ 
//     "favourites.$.isFavourite":true
//   }
// })}
// const updateUser= await userController.readOne({_id:idUser});
// console.log(updateUser);
// return updateUser;
// }

// async function removeFavourite(idEvent, idUser){
//   await userController.update({_id:idUser},{"favourites[_id]":idEvent},{
//     $set:{
//       "favourites.$.isFavourite":false
//     }
//   })
//   console.log(userController.read())

// }


module.exports = {
  createUser,
  findUser,
  sendEventDetailsToAdvertiser,
  forgetPassword,
  changePassword,
  verifyToken,
  // addFavourite,
  // removeFavourite
}