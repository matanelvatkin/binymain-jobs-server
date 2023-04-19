const userController = require("../DL/user.controller");
const jwt = require('jsonwebtoken');

async function createUser(newUserData) {
  const newUser = await userController.create(newUserData);
  return {
    status: "success",
    newUser: newUser,
  };
}

async function findUser(user) {
  const foundUser = await userController.find(user);
  if (foundUser) {
    try {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '10h' });
      return { user: foundUser, token };
    } catch (err) {
      console.error('Error generating Token:', err);
      return { error: 'Error generating JWT token' };
    }
  } else {
    return { error: 'Invalid credentials' };
  }
}

module.exports = {
  createUser,
  findUser,
}