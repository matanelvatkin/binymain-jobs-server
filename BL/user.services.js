const userController = require("../DL/user.controller");

async function createUser(newUserData) {
  const newUser = await userController.create(newUserData);
  return {
    status: "success",
    newUser: newUser,
  };
}

async function findUserByEmail(email) {
  const user = userController.find({email: email});
  return user;
}

module.exports = {
  createUser,
  findUserByEmail,
}