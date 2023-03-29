const userData = require("./user.model");
const { errMessage } = require("../errController");
const bcrypt = require('bcrypt')


async function create(data) {
    return await userData.create(data);
};


async function find(user) {
  const { fullName, password } = user;
  try {
    const foundUser = await userData.findOne({ fullName });
    if (foundUser) {
      const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
      if (isPasswordMatch) {
        return foundUser;
      } else {
        throw new Error('Invalid credentials');
      }
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw new Error('Error finding User');
  }
}


module.exports = {
    create,
    find,
}