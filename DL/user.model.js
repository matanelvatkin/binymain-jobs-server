const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  password: {
    type: String,
  },
  confirmPassword: {
    type: String,
  },
  email: {
    type: String,
  },
})

const users = mongoose.model("user", userSchema);

module.exports = users;