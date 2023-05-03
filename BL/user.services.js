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
  // addFavourite,
  // removeFavourite
}