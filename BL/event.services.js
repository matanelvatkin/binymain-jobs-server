const eventController = require("../DL/event.controller");
const mailInterface = require('./emailInterface')
const eventModel = require('../DL/event.model');

async function createNewEvent(eventData) {
  var dates = [];
  let repeat = 1;
  const days = eventData.day ? getDays(eventData.day) : null;
  switch (eventData.repeatType) {
    case " אירוע יומי":
      repeat = 1;
    case "אירוע שבועי":
      repeat = 7;
    case "בהתאמה אישית":
      if (eventData.personalRepeat === "שבועי") var personalrepeat = 1;
      else if (eventData.personalRepeat === "דו חודשי") var personalrepeat = 7;
      else if (eventData.personalRepeat === "ללא חזרה") var personalrepeat = 1;
  }
  if (
    eventData.repeatSettings?.type === "endDate" &&
    eventData.personalRepeat !== "ללא חזרה"
  ) {
    dates = getDatesWithEndDate(
      eventData.date,
      new Date(eventData.repeatSettings.repeatEnd),
      repeat,
      days,
      personalrepeat
    );
  } else {
    dates = getDatesWithNumberOfOccurrences(
      new Date(eventData.date),
      eventData.personalRepeat !== "ללא חזרה"
        ? eventData.repeatSettings.repeatEnd
        : days.length,
      repeat,
      days,
      personalrepeat
    );
  }
  eventData.date = dates;
  eventData.days = days;

  const newEvent = await eventController.create(eventData);
  return newEvent;
}
const getDays = (days) => {
  const newDays = days.map((day) => {
    switch (day.name) {
      case "א":
        return 0;
      case "ב":
        return 1;
      case "ג":
        return 2;
      case "ד":
        return 3;
      case "ה":
        return 4;
      case "ו":
        return 5;
      case "ש":
        return 6;
    }
  });
  return newDays;
};
function getDatesWithEndDate(startDate, endDate, repeat, days, personalrepeat) {
  const dates = [];
  let currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);
  if (!personalrepeat) {
    console.log("currentDate", currentDate);
    while (currentDate <= endDateObj) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + repeat);
    }
  } else {
    let push = 0,
      indexInWeek = 1;
    while (currentDate <= endDateObj) {
      days.forEach((day) => {
        if (push < days.length && day === new Date(currentDate).getDay()) {
          dates.push(new Date(currentDate));
          push++;
        }
      });
      if (indexInWeek < 7) {
        currentDate.setDate(currentDate.getDate() + 1);
        indexInWeek++;
      } else {
        currentDate.setDate(currentDate.getDate() + personalrepeat);
        indexInWeek = 0;
        push = 0;
      }
    }
  }
  return dates;
}
function getDatesWithNumberOfOccurrences(
  startDate,
  endNumber,
  repeat,
  days,
  personalrepeat
) {
  const dates = [];
  let currentDate = new Date(startDate);
  if (!personalrepeat) {
    while (currentDate && endNumber > 0) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + repeat);
      endNumber--;
    }
  } else {
    let push = 0,
      indexInWeek = 1;
    while (currentDate && endNumber > 0) {
      days.forEach((day) => {
        if (push < days.length && day === new Date(currentDate).getDay()) {
          dates.push(new Date(currentDate));
          endNumber--;
          push++;
        }
      });
      if (indexInWeek < 7) {
        currentDate.setDate(currentDate.getDate() + 1);
        indexInWeek++;
      } else {
        currentDate.setDate(currentDate.getDate() + personalrepeat);
        indexInWeek = 0;
        push = 0;
      }
    }
  }
  return dates;
}


function pagination (filterModel, page, pageSize){
  filterModel.skip((page - 1) * pageSize).limit(pageSize)
  const results = {}
  const endIndex = page * pageSize

  if (endIndex < filterModel.countDocuments().exec()) {
    results.nextPage = page + 1
  }

  results.event = filteredEvents
  return results;
}

async function findEvent(page, pageSize, currentDate, search, skipCount = 0) {
 const filteredEvents = await eventModel.aggregate([
      { $match: { date: { $gte: currentDate }, $or: [{ place: { $regex: search, $options: "i" } }, { eventName: { $regex: search, $options: "i" } }] } },
      { $addFields: { date: { $filter: { input: "$date", as: "date", cond: { $gte: ["$$date", currentDate] } } } } },
      { $sort: { date: 1 } },
      { $skip: skipCount },
      { $limit: pageSize }
    ]);

  const results = {}
  const endIndex = page * pageSize

  if (endIndex < await eventModel.find({ date: { $gte: currentDate }, $or: [{ place: { $regex: search, $options: "i" } }, { eventName: { $regex: search, $options: "i" } }] }).countDocuments().exec()) {
    results.nextPage = page + 1
  }

  results.event = filteredEvents
  return results;
}

async function findEventByID(id, currentDate) {
    const event = await eventController.readOne({ _id: id });
    const futureDates = event.date.filter((date) => new Date(date) >= currentDate);
  event.date = futureDates.slice(0, 1);
  return event;
}


async function eventIsExists(id) {
  return await eventController.read({ id });
}

async function sendEventDetailsToAdvertiser(email, _id) {
  const eventData = await findEventByID(_id);
  const { eventName, summary, advertiser, isReapeated, categories, audiences, registrationPageURL, date, beginningTime, finishTime, place } = eventData;
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

  await mailInterface.sendMail(email, subject, html)

}
module.exports = {
  createNewEvent,
  findEvent,
  findEventByID,
  sendEventDetailsToAdvertiser
};
