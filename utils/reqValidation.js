const { Joi } = require('celebrate');

const signupSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(3),
  name: Joi.string().min(2).max(30),
});

const signinSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(3),
});

const editUserSchema = Joi.object().keys({
  email: Joi.string().email(),
  name: Joi.string().min(2).max(30),
}).unknown(true);

const postMovieSchema = Joi.object().keys({
  country: Joi.string().required(),
  director: Joi.string().required(),
  duration: Joi.number().required(),
  year: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required().pattern(/https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{2,256}\.[a-z]{2,4}\b([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)/),
  trailer: Joi.string().required().pattern(/https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{2,256}\.[a-z]{2,4}\b([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)/),
  nameRU: Joi.string().required(),
  nameEN: Joi.string().required(),
  thumbnail: Joi.string().required().pattern(/https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{2,256}\.[a-z]{2,4}\b([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)/),
  movieId: Joi.number().required(),
});

const delMovieSchema = Joi.object().keys({
  _id: Joi.string().required(),
});

module.exports = {
  signupSchema, signinSchema, editUserSchema, postMovieSchema, delMovieSchema,
};
