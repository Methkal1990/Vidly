require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const error = require("./middlewares/error");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
// create a new express app
const app = express();

// handling exception outsideof express context by listening to the process event uncaughtException
// process.on("uncaughtException", (ex) => {
//   winston.error(ex.message, ex);
// process.exit(1);
// });

// handling exception outside of express context by using winston methods
winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" }),
);

// handling rejected promises outside of express context by using winston methods by listening to the process event unhandledRejection
process.on("unhandledRejection", (ex) => {
  // winston.error(ex.message, ex);
  // process.exit(1);
  throw ex;
});

winston.add(new winston.transports.File({ filename: "logfile.log" }));
winston.add(
  new winston.transports.MongoDB({
    db: "mongodb://localhost/vidly",
    level: "error",
  }),
);

// test for an uncaughtException
// throw new Error(" Something went wrong on the startup of the app");

// test for unhandled promise rejection
const p = Promise.reject(
  new Error("Something went wrong on the startup of the app"),
);

p.then(() => {
  console.log("Done");
});

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is missing");
  process.exit(1);
}

// connect to monogdb database
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Couldn't connect to MongoDB..."));
// add json middleware to understand json data sent from the client
app.use(express.json());
// any request to genres routes use genres module
app.use("/api/genres", genres);
// any request to customers routes use customers module
app.use("/api/customers", customers);
// any request to movies routes use movies module
app.use("/api/movies", movies);
// any request to rentas routes use rentals module
app.use("/api/rentals", rentals);
// any request to user routes use users module
app.use("/api/users", users);
// any request to auth routes use auth module
app.use("/api/auth", auth);

app.use(error);
// get the port from the environment variables otherwise set it to 3000
const port = process.env.Port || 3000;

// listen to requests on PORT
app.listen(port, () => {
  console.log(`Listening on port ${port} ...`);
});
