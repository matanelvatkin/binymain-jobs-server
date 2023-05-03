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
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { user: foundUser, token };
    } catch (err) {
      console.error('Error generating Token:', err);
      return { error: 'Error generating JWT token' };
    }
  } else {
    return { error: 'Invalid credentials' };
  }
}


async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded) {
    const email = decoded.email;
    const verifyedUser = await userController.findEmail(email);
    return verifyedUser;
    }
  } catch (err) {
    if(err.name === 'TokenExpiredError'){
    console.error('token not valid', err.name);
    return { error: 'token is expired' }
    }else{
      return err;
    }
  }
}


// async function addFavourite(idEvent, idUser){
// const allFavourites= await userController.readOne({_id:idUser}, "favourites -_id")
// console.log("check", allFavourites)
// const ifFav= (allFavourites.favourites).filter((f)=>f._id==idEvent );
// console.log("isFav", ifFav)
// if(ifFav.length==0){
//   console.log("inside")
//  await userController.update({_id:idUser}, {$push: {favourites:{idEvent}}});
// }
// else{
// await userController.update({_id:idUser},{"favourites.id":idEvent},{
//   $set:{ 
//     "favourites.$.isFavourite":true
//   }
// })}
// const updateUser= await userController.readOne({_id:idUser});
// console.log(updateUser);
// return updateUser;
// }

// async function removeFavourite(idEvent, idUser){
//   await userController.update({_id:idUser},{"favourites[_id]":idEvent},{
//     $set:{
//       "favourites.$.isFavourite":false
//     }
//   })
//   console.log(userController.read())

// }


module.exports = {
  createUser,
  findUser,
  verifyToken,
  // addFavourite,
  // removeFavourite
}