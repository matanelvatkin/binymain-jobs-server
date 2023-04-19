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
      if (eventData.personalRepeat === "שבועי") var personalrepeat = 1;
      else if (eventData.personalRepeat === "דו חודשי") var personalrepeat = 7;
      else if (eventData.personalRepeat === "ללא חזרה") var personalrepeat = 1;
  }
  if (
    eventData.repeatSettings.type === "endDate" &&
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
    console.log(currentDate);
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

//
