const userController = require("../DL/user.controller");

async function createUser(newUserData) {
  const newUser = await userController.create(newUserData);
  return {
    status: "success",
    newUser: newUser,
  };
}

async function findUser(user) {
  const foundUser = await userController.find(user);
  return foundUser;
}

module.exports = {
  createUser,
  findUser,
}