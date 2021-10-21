const User = require('../models/users');
const NotFound = require('../errors/notfound');
const BadRequest = require('../errors/badrequest');
const Conflict = require('../errors/conflict');
const Server500 = require('../errors/server500');
// const Unauthorized = require('../errors/unauthorized');

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

module.exports = {
  getUserFile, getUserProfileUpdate,
};
