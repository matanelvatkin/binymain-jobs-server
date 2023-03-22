const eventController = require("../DL/event.controller");

async function createNewEvent(eventData) {
  var dates = [];
  var date = eventData.date.split("-");
  const days = eventData.day ? getDays(eventData.day) : null;
  if(eventData.repeat==="שבועי") var repeat= 1;
 else if(eventData.repeat==="דו חודשי") var repeat=7
 else if(eventData.repeat==="חודשי") var repeat=23
  switch (eventData.type) {
    case " אירוע יומי":
      dates = getDayliDates(
        new Date(eventData.date),
        new Date(`${date[0]}-${Number(date[1]) + 3}-${date[2]}`)
      );
    case "אירוע שבועי":
      dates = getWeeklyDates(
        new Date(eventData.date),
        new Date(`${date[0]}-${Number(date[1]) + 3}-${date[2]}`)
      );
    case "חודשי":
      dates = getMonthDates(
        new Date(eventData.date),
        new Date(`${date[0]}-${Number(date[1]) + 3}-${date[2]}`)
      );
    case "בהתאמה אישית":
      dates = getPersonalDates(
        new Date(eventData.date),
        new Date(
          `${date[0]}-${Number(date[1]) + 3}-${Number(date[2])}`
        ),
        days,
        repeat
      );

    // await eventController.create(eventData);
  }
  // const newEvent = await eventController.create(eventData);
  return {
    status: "success",
    newEvent: "ok",
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
function getWeeklyDates(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);
  while (currentDate <= endDateObj) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return dates;
}
function getDayliDates(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);

  while (currentDate <= endDateObj) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
function getPersonalDates(startDate, endDate, days, repeat=1) {
  const dates = [];
  let indexInWeek = 1;
  let push =0;
  let currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);
  while (currentDate <= endDateObj) {
    days.forEach((day) => {
      if (push<2&&day === new Date(currentDate).getDay()){
      dates.push(new Date(currentDate));
      push++
      }
    });
    if (indexInWeek < 7) {
      currentDate.setDate(currentDate.getDate() + 1);
      indexInWeek++
    } else {
      currentDate.setDate(currentDate.getDate() + repeat);
      indexInWeek = 0;
      push = 0
    }
  }
  console.log(dates);
  return dates;
}
function getMonthDates(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);

  while (currentDate <= endDateObj) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 30);
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
