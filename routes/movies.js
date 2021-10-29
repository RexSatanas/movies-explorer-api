const router = require('express').Router();

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const {
  MovieValidation,
  MovieIdValidation,
} = require('../middlewares/validation');

router.post('/movies', MovieValidation, createMovie);

router.get('/movies', getMovies);

router.delete('/movies/:movieId', MovieIdValidation, deleteMovie);

module.exports = router;
