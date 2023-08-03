const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const createToken = (id) => {
  const token = jwt.sign({ id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-key', { expiresIn: '7d' });
  return token;
};

const verifyToken = (token) => {
  const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-key');
  return payload;
};

module.exports = {
  createToken,
  verifyToken,
};
