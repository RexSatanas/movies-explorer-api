const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const isURL = (v) => {
  const result = validator.isURL(v, { require_protocol: true });
  if (result) {
    return v;
  }
  throw new Error('Неверный формат ссылки.');
};

const createUserValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    name: Joi.string().required().min(2).max(30),
  }),
});

const userValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const loginValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const MovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(isURL),
    trailer: Joi.string().required().custom(isURL),
    thumbnail: Joi.string().required().custom(isURL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const MovieIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  userValidate,
  createUserValidate,
  loginValidate,
  MovieValidation,
  MovieIdValidation,
};
