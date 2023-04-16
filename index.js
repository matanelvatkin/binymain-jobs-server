require("dotenv").config();
require("./DL/db").connect();
const mainRouter = require("./Routes");
const express = require("express");
const app = express();
const PORT = process.env.PORמפT || 5000;
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use("/static",express.static("./upload"))

app.use("/api", mainRouter);

// app.get("/k",(req,res)=>{
// res.send("hello world")
// });
app.listen(PORT, () => {
  console.log("Server is running : listening to port " + PORT);
});
