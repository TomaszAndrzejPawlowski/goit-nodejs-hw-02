const Joi = require("joi");

const newUserAuthSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
  token: Joi.string(),
});

// const editContactAuthSchema = Joi.object({
//   name: Joi.string()
//     .pattern(/^[a-zA-Zа-яА-Я]+([ -'][a-zA-Zа-яА-Я]+)*$/)
//     .min(3)
//     .max(50),
//   email: Joi.string().email(),
//   phone: Joi.string()
//     .pattern(/^[+]?[0-9 \u0028\u0029\u002D]*$/)
//     .min(9)
//     .max(24),
//   favorite: Joi.boolean(),
// });

// const editFavContactAuthSchema = Joi.object({
//   favorite: Joi.boolean().required(),
// });

module.exports = {
  newUserAuthSchema,
};
