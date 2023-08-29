const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user.id.toString() })
    .then((data) => res.status(200).send(data))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user.id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const id = req.params.movieId;
  const user = req.user.id;
  Movie.findOne({ movieId: id })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным id не найден');
      }
      if (user !== movie.owner.toHexString()) {
        throw new ForbiddenError('Нет доступа');
      }
      Movie.findOneAndDelete({ movieId: movie.movieId })
        .then((deletedMovie) => res.status(200).send(deletedMovie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
