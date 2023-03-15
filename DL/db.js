const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;

async function connect() {
  try {
    mongoose.connect(
      MONGO_URL,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = { connect };
