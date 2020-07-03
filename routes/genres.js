// a module for genres related routes
const express = require("express");
const router = express.Router();
// mock data
const genres = [
  { id: 1, name: "Thriller" },
  { id: 2, name: "Sci-fi" },
  { id: 3, name: "Anime" },
  { id: 4, name: "Horror" },
  { id: 5, name: "History" },
  { id: 6, name: "Epic" },
];

// get all genres
router.get("/", (req, res) => {
  res.send(genres);
});

// get a specific genre
router.get("/:id", (req, res) => {
  // lookup the genre
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  // if no genre with that id exists return 404 status
  if (!genre) return res.status(404).send("Genre not found");
  // otherwise return the genre
  res.send(genre);
});

// add a new genre
router.post("/", (req, res) => {
  // validate the body sent with the request
  const validation = validateGenre(req.body);
  // if it's not valid then return a 400 bad request and send the error message
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }
  // form the genre object and generate an id
  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };
  // add the genre to the database
  genres.push(genre);
  // send the genre to the client
  res.send(genre);
});

// update an existing genre
router.put("/:id", (req, res) => {
  // lookup the genre
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  // if no genre with that id exists return 404 status
  if (!genre) return res.status(404).send("Genre not found");
  // validate the body sent with the request
  const validation = validateGenre(req.body);
  // if it's not valid then return a 400 bad request and send the error message
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }
  // update the genre
  genre.name = req.body.name;
  // return the genre after updating
  res.send(genre);
});

// delete a genre
router.delete("/:id", (req, res) => {
  // lookup the genre
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  // if no genre with that id exists return 404 status
  if (!genre) return res.status(404).send("Genre not found");
  // delete the genre
  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  // return the deleted genre
  res.send(genre);
});

// helper function to validate the genre data sent from the client
function validateGenre(genre) {
  // the schema that you want to validate against
  const schema = {
    name: Joi.string().min(4).required(),
  };
  // return the validation result
  return Joi.validate(genre, schema);
}

module.exports = router;
