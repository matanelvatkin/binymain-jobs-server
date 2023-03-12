require("dotenv").config();
require("./DL/db").connect();
const mainRouter = require("./Routes");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 2000;
const cors = require("cors");
app.use(express.json());
app.use(cors());

app.use("/api", mainRouter);

app.listen(PORT, () => {
  console.log("Server is running : listening to port " + PORT);
});
