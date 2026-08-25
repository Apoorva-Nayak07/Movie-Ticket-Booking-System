const express = require("express");

const {
  getMovies,
  getMovieById,
  getShows,
  getShowSeats,
} = require("../controllers/movieController");

const router = express.Router();

router.get("/movies", getMovies);
router.get("/movies/:id", getMovieById);

router.get("/shows", getShows);
router.get("/shows/:id/seats", getShowSeats);

module.exports = router;