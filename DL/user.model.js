const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
  },
})

const users = mongoose.model("user", userSchema);

module.exports = users;