const userController = require("../DL/user.controller");

async function createUser(newUserData) {
  const newUser = await userController.create(newUserData);
  return {
    status: "success",
    newUser: newUser,
  };
}

async function findUser(phoneNumber) {
  const user = userController.find({phoneNumber: phoneNumber});
  return user;
}

module.exports = {
  createUser,
  findUser,
}