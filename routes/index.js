const router = require('express').Router();
const { celebrate } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const { signupSchema, signinSchema } = require('../utils/reqValidation');
const authorize = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

const userRoutes = require('./users');
const movieRoutes = require('./movies');

router.post('/signup', celebrate({
  body: signupSchema,
}), createUser);
router.post('/signin', celebrate({
  body: signinSchema,
}), login);

router.use(authorize);

router.use(userRoutes);
router.use(movieRoutes);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Указанная страница не существует.'));
});

module.exports = router;
