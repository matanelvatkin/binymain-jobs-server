const eventController = require("../DL/event.controller");
require("../Dl/db").connect();

async function createNewEvent(eventData) {
  //   productValidation(eventData);
  //   const exists = await eventIsExists(eventData.name);
  //   if (exists.length > 0) throw new Error("event id already exists");

  const newEvent = await eventController.create(eventData);
  return {
    status: "success",
    newEvent: newEvent,
  };
}

async function findEvent() {
  const event = eventController.read();
  return event;
}

async function eventIsExists(id) {
  return await eventController.read({ name });
}

let eventData = [
  {
    name: "fake-event",
    summary: "fake-event description",
    advertiser: {
      name: "kobi",
      tel: "052670403",
      email: "kobikru@gmail.com",
    },
    beginningTime: "19:00",
    finishTime: "21:30",
    place: "שילה",

    cardImageURL:
      "https://cdn.pixabay.com/photo/2023/03/03/17/35/gray-cat-7828134_1280.jpg",
    coverImageURL:
      "https://cdn.pixabay.com/photo/2023/02/12/12/06/ocean-7784940_1280.jpg",

    payment: "free",
  },
];

module.exports = {
  createNewEvent,
  findEvent,
};
