require('dotenv').config()

const express = require('express');
const app = express();
const PORT = process.env.PORT
require("./DL/db").connect();

const cors = require("cors")

app.use(cors())
app.use(express.json())

app.use('/event', require('./Routes/event.route'))

app.listen(PORT, () => {
    console.log('Server is running : listening to port ' + PORT);
})
