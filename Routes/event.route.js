const express = require("express");
const eventRouter = express.Router();
const eventService = require("../BL/event.services");
// const { sendError } = require("../errController");
const multer = require("multer");
const fs = require("fs");

const uuidv4 = require("uuid/v4");
const { sendError } = require("../errController");
const url = "localhost:5000";
const DIR = "upload";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    const { mimetype } = file;
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    cb(
      null,
      `${originalname.split(".")[0]}-${today
        .toLocaleString()
        .replace(/[-\/:]/g, "")}.${originalname.split(".")[1]}`
    );
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});
// router.post('/event',async (req,res)=>{
// })
eventRouter.get("", async (req, res) => {
  try {
    const event = await eventService.findEvent(req.body ? req.body : {});
    res.status(200).send(event);
  } catch (err) {
    sendError(res, err);
  }
});

eventRouter.get("/:eventID", async (req, res) => {
  try {
    console.log(req.params.eventID);
    const event = await eventService.findEventByID(req.params.eventID);
    res.status(200).send(event);
  } catch (err) {
    sendError(res, err);
  }
});

eventRouter.post("/createvent", upload.array, async (req, res) => {
  try {
    const event = await eventService.createNewEvent(req.body);
    res.send(event);
  } catch (err) {
    sendError(res, err);
  }
});

module.exports = eventRouter;
