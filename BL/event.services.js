const eventController = require("../DL/event.controller");
const mailInterface = require('./emailInterface')
const eventModel = require('../DL/event.model');
const settingService = require("../BL/setting.services");

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


// function pagination (filterModel, page, pageSize){
//   filterModel.skip((page - 1) * pageSize).limit(pageSize)
//   const results = {}
//   const endIndex = page * pageSize

//   if (endIndex < filterModel.countDocuments().exec()) {
//     results.nextPage = page + 1
//   }

//   results.event = filteredEvents
//   return results;
// }

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

async function findEventById(id) {
  const event = await eventController.readOne({ _id: id });
  return event;
}

async function findEventByID(id, currentDate) {
  const event = await eventController.readOne({ _id: id });
  const futureDates = event.date.filter((date) => new Date(date) >= currentDate);
event.date = futureDates.slice(0, 1);
return event;
}

async function updateStatusEvent(id, newData) {
    const updateEvent = await eventController.update(id, newData);
    const event = await findEventById(id);
    console.log("eventtttt",event);
    sendEventDetailsToAdvertiser(event.advertiser.email,event._id)
    return updateEvent;
}
// updateStatusEvent("6473a1ae47f64d0ea39712c4", { status: "published" })


async function eventIsExists(id) {
  return await eventController.read({ id });
}

async function sendEventDetailsToAdvertiser(email, _id) {
  const eventData = await findEventById(_id);
  const { eventName, summary, advertiser, categories, audiences, registrationPageURL, date, beginningTime, finishTime, place,cardImageURL,coverImageURL } = eventData;

  const categoriesNames = await settingService.getCategorysNames(categories)
  const audiencesNames = await settingService.getAudiencesNames(audiences)
  const dateTimeString = await date.map(v=>new Date(v).toLocaleDateString('en-US')).join(', ')

  // const dateString = dateArray.join(', '); // Join the individual date strings with a separator (e.g., comma)

  const subject = 'פורסם אירוע חדש - hereEvent'
  const html = `
<div dir="RTL" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
  <h1 style="color: #333; text-align: center;">פרטי אירוע חדש</h1>
  <div style="background-color: #fff; padding: 20px; border-radius: 5px;">
    <p>אירוע חדש פורסם על ידך:</p>
    <div style="margin-bottom: 20px;">
      <h3 style="color: #333;">${eventName}</h3>
      <p><strong>מפרסם:</strong> ${advertiser.name}</p>
      <p><strong>טלפון:</strong> ${advertiser.tel}</p>
      <p><strong>מייל:</strong> ${advertiser.email}</p>
    </div>
    <div style="margin-bottom: 20px;">
      <h3 style="color: #333;">פרטים על האירוע:</h3>
      <p><strong>קטגוריות:</strong> ${categoriesNames.join(', ')}</p>
      <p><strong>קהל יעד:</strong> ${audiencesNames.join(', ')}</p>
      <p><strong>תאריך האירוע:</strong> ${dateTimeString}</p>
      <p><strong>שעות האירוע:</strong> ${beginningTime}-${finishTime}</p>
      <p><strong>מיקום האירוע:</strong> ${place}</p>
      <p><strong>תיאור האירוע:</strong> ${summary}</p>
      <p><strong>דף הרשמה לאירוע:</strong> <a href="${registrationPageURL}">${registrationPageURL}</a></p>
    </div>
    <div>
      <h3 style="color: #333;">תמונות:</h3>
      <div style="display: flex; justify-content: space-between;">
        <img src="${cardImageURL}" alt="Image 1" width="100" height="100" style="margin-right: 10px;">
        <img src="${coverImageURL}" alt="Image 2" width="100" height="100" style="margin-left: 10px;">
      </div>
    </div>
  </div>
</div>`

  //  <li>אירוע חוזר: ${isReapeated}</li>
  // <li>  <a href="">שינוי פרטי האירוע</a> </li>

  await mailInterface.sendMail(email, subject, html)

}

sendEventDetailsToAdvertiser('chatappsapir@gmail.com',"6474448a539c7a35b81cd23a")
// settingService.getCategorysNames(["641189cf3d762f6a181064c7","641189cf3d762f6a181064c8"])


module.exports = {
  createNewEvent,
  findEvent,
  findEventByID,
  findEventById,
  sendEventDetailsToAdvertiser,
  updateStatusEvent
};
