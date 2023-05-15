const express = require("express");
const userRouter = express.Router();
const userServices = require("../BL/user.services");
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
  } catch (err) {
    sendError(res, err);
  }
});

userRouter.post('/forgetPassword',async (req,res)=>{
  try {
    const { email, code } = req.body;
    await userServices.forgetPassword(email,code);
    console.log(email,code);
    res.status(200).send("succses")

  } catch (error) {
    res.status(500).send(error.message);
  }
})

userRouter.post('/resetPassword',async (req,res)=>{
  try {
    const { email ,newPassword } = req.body;
    // await userServices.changePassword(email,newPassword);
    res.status(200).send("password change")

  } catch (error) {
    res.status(500).send(error.message);
  }
})

userRouter.post("/verify", async (req, res) => {
  try {
    const token = req.body.aoutherizetion;
    const verifyUser = await userServices.verifyToken(token);
    if (verifyUser){
    res.status(200).send(verifyUser)
    }else{
      return res.status(401).send({error: 'Token not valid'});
    }
  } catch (err) {
    sendError(res, err);
  }
});


// userRouter.put("/addFavou", async(req,res)=>{
//   try{
//     console.log(req.body);
//     await userServices.addFavourite(req.body.idEvent, req.body.idUser)
//     res.send ("success")
//   }
//   catch(err){
// console.log(err)
//   }
// })


// userRouter.put("/removeFavou", async(req,res)=>{
//   try{
//     console.log(req.body);
//     await userServices.removeFavourite(req.body.idEvent, req.body.idUser)
//     res.send ("success")
//   }
//   catch(err){
// console.log(err)
//   }
// })



module.exports = userRouter;
