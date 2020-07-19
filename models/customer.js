// customer model module for schema and validation
const mongoose = require("mongoose");
const Joi = require("joi");

// a schema for the customer collection
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
  },
});

// create a mongodb collection with the schema
const Customer = mongoose.model("Customer", customerSchema);

// helper function to validate the customer data sent from the client
function validateCustomer(customer) {
  // the schema that you want to validate against
  const schema = {
    name: Joi.string().min(5).max(30).required(),
    phone: Joi.string().min(5).max(30).required(),
    isGold: Joi.boolean(),
  };
  // return the validation result
  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
