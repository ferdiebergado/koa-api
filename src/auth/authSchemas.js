const Joi = require('@hapi/joi');

const schema = {
  name: Joi.string().required(),
  email: Joi.string()
    .max(150)
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .max(150)
    .required(),
  password_confirmation: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match'
    })
};

const { name, email, password, password_confirmation } = schema;

module.exports = {
  loginSchema: Joi.object({
    email,
    password
  }),
  registerSchema: Joi.object({
    name,
    email,
    password,
    password_confirmation
  })
};
