require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const cors = require('cors');
const { createUserValidate, loginValidate } = require('./middlewares/validation');
const { errorLogger, requestLogger } = require('./middlewares/loggers');
const errorHandler = require('./middlewares/errorHandler');
const { login, createUser } = require('./controllers/users');
const usersRoute = require('./routes/users');
const movieRoute = require('./routes/movies');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

const app = express();
app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));
app.use(requestLogger);
app.use('/', express.json());
app.post('/signup', createUserValidate, createUser);
app.post('/signin', loginValidate, login);
app.use(auth);
app.use('/', usersRoute);
app.use('/', movieRoute);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`"работает на ${PORT} порту`);
});
