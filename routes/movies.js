const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { postMovieSchema, delMovieSchema } = require('../utils/reqValidation');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: postMovieSchema,
}), createMovie);

router.delete('/movies/:movieId', celebrate({
  params: delMovieSchema,
}), deleteMovie);

module.exports = router;
