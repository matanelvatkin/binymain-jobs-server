const express = require("express");
const eventRouter = express.Router();
const eventService = require("../BL/event.services");
// const { sendError } = require("../errController");
const multer = require("multer");
const fs = require("fs");
const ADMIN_MAIL = process.env.ADMIN_MAIL;

const uuidv4 = require("uuid/v4");
const { sendError } = require("../errController");
const { log } = require("console");
const { sendMail } = require("../BL/emailInterface");
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
      return `${req.protocol}://${req.headers.host}/${DIR}/${file.path}`;
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

eventRouter.post("", async (req, res) => {
  try {
    const search = req.body.search || "";
    const page = parseInt(req.body.page) || 1;
    const pageSize = req.body.pageSize || 5; //  אמור להיות קבוע וכרגע נשלח מהקליינט
    const currentDate = req.body.currentDate || new Date();
    const skipCount = (page - 1) * pageSize;
    const data = await eventService.findEvent(
      page,
      pageSize,
      currentDate,
      search,
      skipCount
    );
    res.status(200).send(data);
  } catch (err) {
    sendError(res, err);
  }
});

eventRouter.get("/:eventID", async (req, res) => {
  try {
    const currentDate = req.body.currentDate || new Date();
    console.log("req.params.eventID", req.params.eventID);
    const event = await eventService.findEventByID(
      req.params.eventID,
      currentDate
    );
    res.status(200).send(event);
  } catch (err) {
    sendError(res, err);
  }
});

eventRouter.post("/createvent", multiUpload, async (req, res) => {
  try {
    const { cardImageURL, coverImageURL, gallery } = req.files;
    const dataEvent = JSON.parse(req.body.values);
    console.dir(dataEvent);
    if (cardImageURL) {
      dataEvent.cardImageURL = `${req.protocol}://${req.headers.host}/${DIR}/${cardImageURL[0].filename}`;
    }
    if (coverImageURL) {
      dataEvent.coverImageURL = `${req.protocol}://${req.headers.host}/${DIR}/${coverImageURL[0].filename}`;
    }
    if (gallery) {
      dataEvent.gallery = gallery.map(
        (file) =>
          `${req.protocol}://${req.headers.host}/${DIR}/${file.filename}`
      );
    }
    console.log({ dataEvent });
    const event = await eventService.createNewEvent(dataEvent);
    res.send(event);
    //TODO: send to email function
    sendMail(
      ADMIN_MAIL,
      "אירוע חדש לאישור",
      `https://server-vike.vercel.app/viewEvent/${event._id}`
    );
  } catch (err) {
    sendError(res, err);
  }
});

module.exports = eventRouter;
