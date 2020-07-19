// customer model module for schema and validation
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

// a schema for the users collection
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey"),
  );
  return token;
};

// create a mongodb collection with the schema
const User = mongoose.model("User", userSchema);

// helper function to validate the user data sent from the client
function validateUser(user) {
  // the schema that you want to validate against
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };
  // return the validation result
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
