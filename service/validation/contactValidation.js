const Joi = require("joi");

const newContactAuthSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Zа-яА-Я]+([ -'][a-zA-Zа-яА-Я]+)*$/)
    .min(3)
    .max(50)
    .required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[+]?[0-9 \u0028\u0029\u002D]*$/)
    .min(9)
    .max(24)
    .required(),
  favorite: Joi.boolean(),
});

const editContactAuthSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Zа-яА-Я]+([ -'][a-zA-Zа-яА-Я]+)*$/)
    .min(3)
    .max(50),
  email: Joi.string().email(),
  phone: Joi.string()
    .pattern(/^[+]?[0-9 \u0028\u0029\u002D]*$/)
    .min(9)
    .max(24),
  favorite: Joi.boolean(),
});

const editFavContactAuthSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const paginationAuthSchema = Joi.object({
  page: Joi.number().min(1).required(),
  limit: Joi.number().min(1).max(20).required(),
});

const contactIsFavoriteAuthSchema = Joi.object({
  favorite: Joi.bool().required(),
});

module.exports = {
  newContactAuthSchema,
  editContactAuthSchema,
  editFavContactAuthSchema,
  paginationAuthSchema,
  contactIsFavoriteAuthSchema,
};
