/* eslint-disable no-useless-catch */
const userService = require('./service');

module.exports = {
  login: async (ctx, _next) => {
    try {
      const { email, password } = ctx.request.body;
      const { payload, signature } = await userService.login(email, password);
      ctx.cookies.set('fsbapp.session.id', signature, {
        signed: true,
        secure: process.env.SSL === 'true'
      });
      ctx.status = 200;
      ctx.body = { access_token: payload };
    } catch (error) {
      throw error;
    }
  }
};
