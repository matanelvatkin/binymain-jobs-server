const express = require("express");
const userRouter = express.Router();
const usetServices = require("../BL/user.services");
const { sendError , errorMsg} = require("../errController");


userRouter.get("/findUser", async (req, res) => {
    try {
      console.log(req.params.email);
      const user = await usetServices.findUserByEmail(req.params.email);
      res.status(200).send(user);
  
    } catch (err) {
      sendError(res, err);
    }
  });


userRouter.post("/creatUser", async (req, res) => {
    try {
      const user = await usetServices.createUser(req.body);
      res.status(400).send(user);
    } catch (err) {
      sendError(res, err);
    }
  });

// userRouter.delete('', async (req, res) => {

// });

// userRouter.put('', async (req, res) => {

// });

module.exports = userRouter;
