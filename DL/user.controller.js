const userData = require("./user.model");
const { errMessage } = require("../errController");


async function create(data) {
    return await userData.create(data);
};


async function find(user) {
  const { fullName, password } = user;
  try {
    const foundUser = await userData.findOne({ fullName });
    if (foundUser && foundUser.password === password) {
      return foundUser;
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    throw new Error('Error finding user');
  }
}


module.exports = {
    create,
    find,
}