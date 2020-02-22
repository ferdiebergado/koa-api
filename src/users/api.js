/* eslint-disable no-useless-catch */
const Joi = require('@hapi/joi');
const userService = require('./service');

module.exports = {
  show: async (ctx, _next) => {
    try {
      // Validate input
      const { user } = ctx.params;
      const schema = Joi.object().keys({
        user: Joi.number()
      });
      await schema.validateAsync({ user });

      // Id is valid, invoke the user service to fetch the user with the specified id
      const u = await userService.find(user);

      // User exists, respond with the user
      ctx.status = 200;
      ctx.body = { data: u };
    } catch (error) {
      // Bubble up the error to the global error handler
      throw error;
    }
  }
};
