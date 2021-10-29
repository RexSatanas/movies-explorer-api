const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFound = require('../errors/notfound');
const BadRequest = require('../errors/badrequest');
const Conflict = require('../errors/conflict');
const Server500 = require('../errors/server500');
const Unauthorized = require('../errors/unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserFile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFound('пользователь с указанным id не найден')))
    .then((user) => {
      res.status(200).send(user);
    });
};

const getUserProfileUpdate = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные'));
      } else if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new Conflict(`Указанная почта ${email} уже зарегистрирована`));
      } else {
        next(new Server500('Ошибка на сервере'));
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      console.log(user);
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректно введенны данные в поле'));
      } if (err.code === 11000) {
        next(new Conflict('Указанный пользователь уже зарегистрирован'));
      } else {
        next(new Server500('Ошибка на сервере'));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(new Unauthorized(`необходимо авторизоваться: ${err.message}`));
    });
};

module.exports = {
  getUserFile, getUserProfileUpdate, createUser, login,
};
