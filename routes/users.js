const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getUser, updateUserData,
} = require('../controllers/users');
const { editUserSchema } = require('../utils/reqValidation');

router.get('/users/me', getUser);

router.patch('/users/me', celebrate({
  body: editUserSchema,
}), updateUserData);

module.exports = router;
