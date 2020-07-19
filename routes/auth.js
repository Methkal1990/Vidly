// a module for users related routes
const _ = require("lodash");
const express = require("express");
const { User } = require("../models/user");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");

// creat new user
router.post("/", async (req, res) => {
  // validate the body sent with the request
  const validation = validate(req.body);
  // if it's not valid then return a 400 bad request and send the error message
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return res.status(400).send("Invalid email password");

  const token = user.generateAuthToken();

  res.send(token);
});

// helper function to validate the login data sent from the client
function validate(req) {
  // the schema that you want to validate against
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };
  // return the validation result
  return Joi.validate(req, schema);
}

module.exports = router;
