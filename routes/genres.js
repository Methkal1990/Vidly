// a module for genres related routes
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const express = require("express");
const { Genre, validate } = require("../models/genre");
const router = express.Router();

// get all genres
router.get("/", async (req, res, next) => {
  throw new Error("Coudn't fetcth the data");
  try {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  } catch (ex) {
    next(ex);
  }
});

// get a specific genre
router.get("/:id", async (req, res) => {
  // lookup the genre
  const genre = await Genre.findById(req.params.id);
  // if no genre with that id exists return 404 status
  if (!genre) return res.status(404).send("Genre not found");
  // otherwise return the genre
  res.send(genre);
});

// add a new genre
router.post("/", auth, async (req, res) => {
  // validate the body sent with the request
  const validation = validate(req.body);
  // if it's not valid then return a 400 bad request and send the error message
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }
  // form the genre object and generate an id
  let genre = new Genre({ name: req.body.name });
  // add the genre to the database
  await genre.save();
  // send the genre to the client
  res.send(genre);
});

// update an existing genre
router.put("/:id", async (req, res) => {
  // validate the body sent with the request
  const validation = validateGenre(req.body);
  // if it's not valid then return a 400 bad request and send the error message
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }
  // lookup the genre in the database and update it then return it
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    },
  );
  // if no genre with that id exists return 404 status
  if (!genre) return res.status(404).send("Genre not found");

  // return the genre after updating
  res.send(genre);
});

// delete a genre
router.delete("/:id", [auth, admin], async (req, res) => {
  // lookup the genre and remove it
  const genre = await Genre.findByIdAndRemove(req.params.id);
  // if no genre with that id exists return 404 status
  if (!genre) return res.status(404).send("Genre not found");

  // return the deleted genre
  res.send(genre);
});

module.exports = router;
