const express = require("express");
const filesRouter = express.Router();
const multer = require("multer");
const upload = multer({ dest: "../upload/" });
const fs = require("fs");
const { sendError } = require("../errController");
const url = "localhost:5000";

filesRouter.post("/uploadFile", upload.single("card"), (req, res) => {
  let fileType = req.file.mimetype.split("/")[1];
  let newFileName = req.file.filename + "." + fileType;

  fs.rename(
    `../upload/${req.file.filename}`,
    `./upload/${newFileName}`,
    function () {
      res.send(`${url}/static/${newFileName}`);
    }
  );
});

module.exports = filesRouter;
