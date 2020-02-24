const Joi = require('@hapi/joi');

const invalidToken = 'Invalid token';

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
    }),
  token: Joi.string()
    .hex()
    .min(128)
    .max(155)
    .messages({
      'string.hex': invalidToken,
      'string.min': invalidToken,
      'string.max': invalidToken
    })
};

// eslint-disable-next-line camelcase
const { name, email, password, password_confirmation, token } = schema;

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
  }),
  tokenSchema: Joi.object({ token }),
  passwordResetSchema: Joi.object({ email }),
  resetPasswordSchema: Joi.object({ password, password_confirmation })
};
