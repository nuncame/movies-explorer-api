const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { createToken } = require('../utils/jwt');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unathorized-err');

const createUser = (req, res, next) => {
  const {
    email, name, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email, name, password: hash,
    }))
    .then((user) => res
      .status(201)
      .send({
        email: user.email, name: user.name, _id: user._id,
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Такой e-mail уже используется'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      }
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if (!passwordMatch) {
          return next(new UnauthorizedError('Неправильные почта или пароль'));
        }
        const jwt = createToken(user._id);
        const { name } = user;
        return res.status(200).send({
          email, name, token: jwt,
        });
      });
      return false;
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const userId = req.user.id.toString();
  return User.findById(userId)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const updateUserData = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user.id,
    { email: req.body.email, name: req.body.name },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден.');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Такой e-mail уже используется'));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  login,
  getUser,
  updateUserData,
};
