const express = require("express");
const Joi = require("joi");
const genres = require("./routes/genres");
// create a new express app
const app = express();

// add json middleware to understand json data sent from the client
app.use(express.json());
app.use("/api/genres", genres);
// get the port from the environment variables otherwise set it to 3000
const port = process.env.Port || 3000;

// listen to requests on PORT
app.listen(port, () => {
  console.log(`Listening on port ${port} ...`);
});
