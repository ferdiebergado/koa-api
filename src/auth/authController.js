/* eslint-disable no-useless-catch */
const Joi = require('@hapi/joi');
const authService = require('./authService');

module.exports = {
  login: async (ctx, _next) => {
    try {
      // Validate input
      const schema = Joi.object({
        email: Joi.string()
          .max(150)
          .email()
          .required(),
        password: Joi.string()
          .min(8)
          .max(150)
          .required()
          .strict()
      });
      const { email, password } = await schema.validateAsync(ctx.request.body, {
        abortEarly: false
      });

      // Input is valid, check if the account exists
      const { payload, signature } = await authService.login(email, password);

      // Account exists, send the access token with the jwt cookie
      ctx.cookies.set('fsbapp.session.id', signature, {
        signed: true,
        secure: process.env.SSL === 'true'
      });
      ctx.status = 200;
      ctx.body = { access_token: payload };
    } catch (error) {
      // Bubble up the error to the global error handler
      throw error;
    }
  },
  register: async (ctx, _next) => {
    try {
      // Validate input
      const schema = Joi.object({
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
          .error(errors => {
            errors.forEach(err => {
              if (err.code === 'any.only') {
                // eslint-disable-next-line no-param-reassign
                err.message = 'Passwords do not match';
              }
            });
            return errors;
          })
      });
      const validated = await schema.validateAsync(ctx.request.body, { abortEarly: false });

      // Input valid, register the user
      const user = await authService.register(validated);
      ctx.status = 201;
      ctx.body = user;
    } catch (error) {
      throw error;
    }
  }
};
