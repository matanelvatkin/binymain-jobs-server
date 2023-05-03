const userData = require("./user.model");
const { errMessage } = require("../errController");
const bcrypt = require('bcrypt')


async function create(data) {
  try {
    const findEmail = await userData.findOne({email:data.email});
    if (findEmail) {
      throw new Error('Email alredy in use');
    } else {
      return await userData.create(data);
    }
  } catch (error) {
    throw error;
  }
   
};


async function find(user) {
  const { email, password } = user;
  try {
    const foundUser = await userData.findOne({ email });
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


async function findEmail(email) {
  try {
    const foundUser = await userData.findOne({email});
    if (foundUser) {
      return foundUser
    } else {
      throw new Error('Email not found');
    }
  } catch (error) {
    throw new Error('Error finding Email');
  }
}

async function read(filter, proj){
  return await userData.find({filter}, proj);
}

async function readOne (filter, proj){
  let res= await read(filter, proj);
  return res[0]

}

async function update(filter, newData){
  return await userData.updateOne(filter, newData)

}



module.exports = {
    create,
    find,
}