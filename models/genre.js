// customer model module for schema and validation
const mongoose = require("mongoose");
const Joi = require("joi");

// a schema for the genre collection
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
  },
});

// create a mongodb collection with the schema
const Genre = mongoose.model("Genre", genreSchema);

// helper function to validate the genre data sent from the client
function validateGenre(genre) {
  // the schema that you want to validate against
  const schema = {
    name: Joi.string().min(4).required(),
  };
  // return the validation result
  return Joi.validate(genre, schema);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;
