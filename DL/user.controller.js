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
  const { email } = user;
  try {
    const foundUser = await userData.findOne({ email });
    return foundUser;
  } catch (error) {
    return { error: 'לא הצליח למצוא משתמש' };
  }
}

async function update(email, newData) {
  return await userData.updateOne({ email: email}, newData)
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

// async function update(filter, newData){
//   return await userData.updateOne(filter, newData)

// }



module.exports = {
    create,
    find,
    update,
    findEmail
}