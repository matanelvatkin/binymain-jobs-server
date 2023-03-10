const { read } = require('../DL/event.controller');

async function getAllEvents() {
    return await read({})
}

async function getFilteredEvents(filter) {
    return await read(filter)
}

module.exports = { getAllEvents, getFilteredEvents }