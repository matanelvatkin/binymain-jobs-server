const express = require("express");
const eventRouter = express.Router();
const eventService = require("../BL/event.services");
const { sendError } = require("../errController");

// router.post('/event',async (req,res)=>{
// })
eventRouter.get("", async (req, res) => {
  try {
    const event = await eventService.findEvent();
    res.status(200).send(event);
  } catch (err) {
    sendError(res, err);
  }
});
eventRouter.post("/createvent", async (req, res) => {
  try {
    const event = await eventService.createNewEvent(req.body);
    res.status(200).send(event);
  } catch (err) {
    sendError(res, err);
  }
});

module.exports = eventRouter;
