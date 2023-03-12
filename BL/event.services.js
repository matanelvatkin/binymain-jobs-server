const eventController = require("../DL/event.controller");
require("../Dl/db").connect();

async function createNewEvent(eventData) {
  productValidation(eventData);
  const exists = await eventIsExists(eventData.name);
  if (exists.length > 0) throw new Error("event id already exists");

  const newEvent = await eventController.create(eventData);
  return {
    status: "success",
    newEvent: newEvent,
  };
}

async function eventIsExists(id) {
  return await eventController.read({ name });
}
