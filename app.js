require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./utils/limiter');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('db connected');
  });

const app = express();
app.use(express.json());

const allowedCors = [
  'https://mymovies-nuncame.nomoreparties.co',
  'http://mymovies-nuncame.nomoreparties.co',
  'http://localhost:3001',
];

app.use(cors({
  origin: allowedCors,
  methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(requestLogger);

app.use(limiter);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
