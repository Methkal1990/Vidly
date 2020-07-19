// module for customers related routes
const express = require("express");
const { Customer, validate } = require("../models/customer");
const router = express.Router();

// get all customers
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

// add a new customer
router.post("/", async (req, res) => {
  // validate the body sent with the request
  const validation = validate(req.body);
  // if it's not valid then return a 400 bad request and send the error message
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }
  // form the customer object and generate an id
  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  // add the genre to the database
  await customer.save();
  // send the genre to the client
  res.send(customer);
});

// get a specific customer
router.get("/:id", async (req, res) => {
  // lookup the customer
  const customer = await Customer.findById(req.params.id);
  // if no customer with that id exists return 404 status
  if (!customer) return res.status(404).send("Customer not found");
  // otherwise return the customer
  res.send(customer);
});

// update an existing customer
router.put("/:id", async (req, res) => {
  // validate the body sent with the request
  const validation = validate(req.body);
  // if it's not valid then return a 400 bad request and send the error message
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }
  // lookup the customer in the database and update it then return it
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, phone: req.body.phone, isGold: !!req.body.isGold },
    {
      new: true,
    },
  );
  // if no customer with that id exists return 404 status
  if (!customer) return res.status(404).send("Customer not found");

  // return the customer after updating
  res.send(customer);
});

// delete a customer
router.delete("/:id", async (req, res) => {
  // lookup the customer and remove it
  const customer = await Customer.findByIdAndRemove(req.params.id);
  // if no customer with that id exists return 404 status
  if (!customer) return res.status(404).send("Customer not found");

  // return the deleted customer
  res.send(customer);
});

module.exports = router;
