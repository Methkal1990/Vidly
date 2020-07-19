// a module for users related routes
const auth = require("../middlewares/auth");
const _ = require("lodash");
const express = require("express");
const { User, validate } = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");

// get current user
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

// creat new user
router.post("/", async (req, res) => {
  // validate the body sent with the request
  const validation = validate(req.body);
  // if it's not valid then return a 400 bad request and send the error message
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(400).send("User already registered");

  user = new User(_.pick(req.body, ["password", "name", "email"]));

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  // send the user to the client
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
