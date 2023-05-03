const express = require("express");
const eventRouter = express.Router();
const eventService = require("../BL/event.services");
// const { sendError } = require("../errController");
const multer = require("multer");
const fs = require("fs");

const uuidv4 = require("uuid/v4");
const { sendError } = require("../errController");
const { log } = require("console");
const URL = "localhost:5000";
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
        .replace(/[-\/:,\s]/g, "")}.${mimetype.split("/")[1]}`
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
      return `${URL}/${DIR}/${file.path}`;
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});
const multiUpload = upload.fields([
  { name: "cardImageURL", maxCount: 1 },
  { name: "coverImageURL", maxCount: 1 },
  { name: "gallery", maxCount: 5 },
]);
// router.post('/event',async (req,res)=>{
// })
eventRouter.post("", async (req, res) => {
  try {
    const event = await eventService.findEvent(req.body ? req.body : {});
    res.status(200).send(event);
  } catch (err) {
    sendError(res, err);
  }
});

eventRouter.get("/:eventID", async (req, res) => {
  try {
    console.log("req.params.eventID", req.params.eventID);
    const event = await eventService.findEventByID(req.params.eventID);
    res.status(200).send(event);
  } catch (err) {
    sendError(res, err);
  }
});

eventRouter.post("/createvent", multiUpload, async (req, res) => {
  try {
    console.log("hello");
    const { cardImageURL, coverImageURL, gallery } = req.files;
    const dataEvent = JSON.parse(req.body.values);
    console.dir(dataEvent);
    // console.log({ carImageURL: cardImageURL[0].path });

    // console.log("dataEvent", dataEvent);
    if (cardImageURL) {
      dataEvent.cardImageURL = `${URL}/${DIR}/${cardImageURL[0].filename}`;
    }
    if (coverImageURL) {
      dataEvent.coverImageURL = `${URL}/${DIR}/${coverImageURL[0].filename}`;
    }
    if (gallery) {
      dataEvent.gallery = gallery.map(
        (file) => `${URL}/${DIR}/${file.filename}`
      );
    }
    console.log({ dataEvent });
    const event = await eventService.createNewEvent(dataEvent);
    res.send(event);
    //TODO: send to email function
  } catch (err) {
    sendError(res, err);
  }
});

// eventRouter.post("/createvent", multiUpload, async (req, res) => {
//   try {
//     const newFile = req.files.filename;
//     const dataEvent = req.body.event;
//     console.log("req.files", req.files);
//     console.log(newFile);
//     const event = await eventService.createNewEvent(dataEvent);
//     res.send(event);
//   } catch (err) {
//     sendError(res, err);
//   }
// });

module.exports = eventRouter;
