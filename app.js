require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes/index');
const { errorLogger, requestLogger } = require('./middlewares/loggers');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/limiter');
const {
  dataMovies,
  PORT,
} = require('./utils/config');

mongoose.connect(dataMovies, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(limiter);
app.use(requestLogger);
app.use('/', express.json());
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`"работает на ${PORT} порту`);
});
