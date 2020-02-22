/* eslint-disable no-useless-catch */
const Joi = require('@hapi/joi');
const userService = require('./service');

module.exports = {
  login: async (ctx, _next) => {
    try {
      // Validate input
      const { email, password } = ctx.request.body;
      const schema = Joi.object().keys({
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
      await schema.validateAsync({ email, password });

      // Input is valid, invoke the user service to check if the account exists
      const { payload, signature } = await userService.login(email, password);

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
  }
};
