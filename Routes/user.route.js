const express = require("express");
const userRouter = express.Router();
const userServices = require("../BL/user.services");
const { sendError , errorMsg} = require("../errController");


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
    const { fullName, password } = req.body;
    const user = await userServices.findUser({ fullName, password });
    res.status(200).send(user);
  } catch (err) {
    sendError(res, err);
  }
});

userRouter.post('/resetPass',async (req,res)=>{
  try {
    const { email, code } = req.body;
    // await userServices.forgetPassword(email,code);
    console.log(email,code);
    res.status(200).send("succses")

  } catch (error) {
    res.status(500).send(error.message);
  }
})

module.exports = userRouter;
