const { trusted } = require("mongoose");
const mongoose = require("mongoose");
require("./setting.model");

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    // require: true,
  },
  summary: {
    type: String,
  },
  advertiser: {
    name: {
      type: String,
      // require: true,
    },
    tel: {
      type: String,
      // require: true,
    },
    email: {
      type: String,
      // require: true,
    },
  },
  date: [{
    type: Date,
  }],
  beginningTime: {
    type: String,
  },
  finishTime: {
    type: String,
  },
  place: {
    type: String,
    // require: true,
  },
  category: [
    {
      type: String,
      //require: true,
    },
  ],
  targetAudience: [
    {
      type: String,
      //require: true,
    },
  ],
  registrationPageURL: {
    type: String,
    // require: false,
  },
  cardImageURL: {
    type: String,
    // require: true,
  },
  coverImageURL: {
    type: String,
    // require: true,
  },
  type: {
    type: String,
  },
  // gallery: [
  //   {
  //     imageURL: {
  //       type: String,
  //       require: false,
  //     },
  //   },
  // ],
  // payment: {
  //   type: String,
  //   enum: ["free", "in-payment"],
  //   default: "free",
  //   details: [
  //     {
  //       cardType: String,
  //       price: Number,
  //       require: false,
  //     },
  //   ],
  //   require: false,
  // },
  // status: {
  //   type: String,
  //   enum: ["published", "waiting-for-approval", "invalid", "deleted"],
  //   default: "waiting-for-approval",
  // },
});

const events = mongoose.model("event", eventSchema);

module.exports = events;
