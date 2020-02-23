/* eslint-disable no-useless-catch */
const authService = require('./authService');

module.exports = {
  login: async (ctx, _next) => {
    try {
      // check if the account exists
      const { email, password } = ctx.request.body;
      const { payload, signature } = await authService.login(email, password);

      // Account exists, set the jwt cookie
      ctx.cookies.set('fsbapp.session.id', signature, {
        signed: true,
        secure: process.env.SSL === 'true'
      });

      // Set status to OK
      ctx.status = 200;

      // respond with the access token
      ctx.body = { access_token: payload };
    } catch (error) {
      // Bubble up the error to the global error handler
      throw error;
    }
  },
  register: async (ctx, _next) => {
    try {
      // Create the user account
      const user = await authService.register(ctx.request.body);

      // Set status to Created
      ctx.status = 201;

      // respond with the new user
      ctx.body = user;
    } catch (error) {
      // Bubble up the error to the global error handler
      throw error;
    }
  }
};
