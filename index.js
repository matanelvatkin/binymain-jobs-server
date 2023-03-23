require("dotenv").config();
require("./DL/db").connect();
const mainRouter = require("./Routes");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use("/static",express.static("./upload"))

app.use("/api", mainRouter);

const events = require('./DL/event.model')
async function check(){
  console.log(await events.find({
    "category": {
        "$in": [
            "641189cf3d762f6a181064ca"
        ]
    },
    "targetAudience": {
        "$in": [
            "64118b289057ecc057ef8a3b"
        ]
    },
    "date": {
        "$gte": "2023-03-23T14:41:13.130Z",
        "$lte": "2023-03-23T21:59:59.130Z"
    }
  }).exec())
}

check()

// app.get("/k",(req,res)=>{
// res.send("hello world")
// });
app.listen(PORT, () => {
  console.log("Server is running : listening to port " + PORT);
});
