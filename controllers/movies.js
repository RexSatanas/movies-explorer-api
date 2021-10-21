const Movies = require('../models/movies');
const BadRequest = require('../errors/badrequest');
const Forbidden = require('../errors/forbidden');

const getMovies = (req, res, next) => {
  Movies.find()
    .then((movies) => {
      res.status(200)
        .send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(200)
      .send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некоректные данные'));
      } else {
        next(err);
      }
    });
};
const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  const { movieId } = req.params;
  Movies.findById(movieId)
    .then((movie) => {
      if (owner.toString() === movie.owner.toString()) {
        return movie.remove()
          .then(() => res.status(200)
            .send({ message: 'Фильм удалён' }));
      }
      throw new Forbidden('нет прав на удаление фильма');
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
