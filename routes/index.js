const express = require('express');

const router = express.Router();
const usersRoute = require('./users');
const movieRoute = require('./movies');
const { login, createUser } = require('../controllers/users');
const { createUserValidate, loginValidate } = require('../middlewares/validation');
const NotFound = require('../errors/notfound');
const auth = require('../middlewares/auth');

router.post('/signup', createUserValidate, createUser);
router.post('/signin', loginValidate, login);
router.use(auth);
router.use('/', usersRoute);
router.use('/', movieRoute);

router.all('*', (req, res, next) => {
  next(new NotFound('ресурс не найден.'));
});

module.exports = router;
