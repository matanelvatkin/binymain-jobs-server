const express = require("express");
const userRouter = express.Router();
const userServices = require("../BL/user.services");
const { sendError , errorMsg} = require("../errController");


userRouter.get("/findUser", async (req, res) => {
    try {
      console.log(req);
      const user = await userServices.findUser(req);
      res.status(200).send(user);
  
    } catch (err) {
      sendError(res, err);
    }
  });


userRouter.post("/creatUser", async (req, res) => {
    try {
      const user = await userServices.createUser(req.body);
      res.status(200).send(user);
    } catch (err) {
      sendError(res, err);
    }
  });

// userRouter.delete('', async (req, res) => {

// });

// userRouter.put('', async (req, res) => {

// });

module.exports = userRouter;
