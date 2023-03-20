const eventController = require("../DL/event.controller");

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

async function findEvent(filter) {
  const event = eventController.read(filter);
  return event;
}

async function findEventByID(id) {
  const event = eventController.readOne({_id:id});
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