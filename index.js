const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { createUserValidate, loginValidate } = require('./middlewares/validation');
const { errorLogger, requestLogger } = require('./middlewares/loggers');
const errorHandler = require('./middlewares/errorHandler');
const { login, createUser } = require('./controllers/users');
const {
  dataMovies,
  PORT,
} = require('./utils/dbconfig');
const usersRoute = require('./routes/users');
const movieRoute = require('./routes/movies');
const auth = require('./middlewares/auth');

mongoose.connect(dataMovies, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const app = express();
app.use(requestLogger);
app.use(helmet());
app.use('/', express.json());
app.post('/signup', createUserValidate, createUser);
app.post('/signin', loginValidate, login);
app.use(auth);
app.use('/', usersRoute);
app.use('/', movieRoute);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT);
