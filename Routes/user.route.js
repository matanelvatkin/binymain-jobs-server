const express = require("express");
const userRouter = express.Router();
const userServices = require("../BL/user.services");
const jwt = require('jsonwebtoken');
const { sendError, errorMsg } = require("../errController");


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

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userServices.findUser({ email, password });
    res.status(200).send(user)

    // if (user) {
    //   const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    //   res.status(200).send({ user, token });
    // } else {
    //   res.status(401).send({ error: 'Invalid credentials' });
    // }

  } catch (err) {
    sendError(res, err);
  }
});


module.exports = userRouter;
