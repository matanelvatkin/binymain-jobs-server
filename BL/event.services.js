const eventController = require("../DL/event.controller");

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
      if (eventData.repeatType === "שבועי") var personalrepeat = 1;
      else if (eventData.repeatType === "דו חודשי") var personalrepeat = 7;
      else if (eventData.repeatType === "חודשי") var personalrepeat = 23;
      switch (eventData.repeatSettings.type) {
        case "date":
          dates = getDatesWithEndDate(
            new Date(eventData.date),
            new Date(eventData.repeatSettings.repeatEnd),
            repeat,
            days,
            personalrepeat
          );

        case "occurrences":
          dates = getDatesWithNumberOfOccurrences(
            new Date(eventData.date),
            eventData.repeatSettings.repeatEnd,
            repeat,
            days,
            personalrepeat
          );
      }

    // await eventController.create(evenctData);
  }
  // const newEvent = await eventController.create(eventData);
  return {
    eventName: eventData.eventName,
    summary: eventData.summary,
    advertiser: eventData.advertiser,
    isReapeated: !eventData.repeatType === "אירוע ללא חזרה",
    repeatType: eventData.repeatType,
    date: dates,
    deletedDate: [],
    days: days,
    // repeatSettings: {
    //   type: eventData.repeatSettings.type,
    //   repeatEnd: eventData.repeatSettings.repeatEnd,
    // },
    beginningTime: eventData.beginningTime,
    finishTime: eventData.finishTime,
    place: eventData.place,
    category: eventData.category,
    targetAudience: eventData.targetAudience,
    registrationPageURL: eventData.registrationPageURL,
    cardImageURL: eventData.cardImageURL,
    coverImageURL: eventData.coverImageURL,
  };
}
const getDays = (days) => {
  const newDays = days.map((day) => {
    switch (day) {
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
  endDate,
  repeat,
  days,
  personalrepeat
) {
  const dates = [];
  let currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);
  if (!personalrepeat) {
    while (currentDate <= endDateObj && endDate > 0) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + repeat);
      endDate--;
    }
  } else {
    let push = 0,
      indexInWeek = 1;
    while (currentDate <= endDateObj && endDate > 0) {
      days.forEach((day) => {
        if (push < days.length && day === new Date(currentDate).getDay()) {
          dates.push(new Date(currentDate));
          endDate--;
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
async function findEvent(filter) {
  const event = eventController.read(filter);
  return event;
}

async function findEventByID(id) {
  const event = eventController.readOne({ _id: id });
  return event;
}

async function eventIsExists(id) {
  return await eventController.read({ id });
}

module.exports = {
  createNewEvent,
  findEvent,
  findEventByID,
};

// module.exports = { getAllEvents, getFilteredEvents }
