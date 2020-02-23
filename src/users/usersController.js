/* eslint-disable no-useless-catch */
const Joi = require('@hapi/joi');
const usersService = require('./usersService');

module.exports = {
  show: async (ctx, _next) => {
    try {
      // Validate route id parameter
      const schema = Joi.object({
        user: Joi.number()
      });
      const { user } = await schema.validateAsync({ user: ctx.params.user });

      // Id is valid, fetch the user with the specified id
      const u = await usersService.find(user);

      // User exists, respond with the user
      ctx.status = 200;
      ctx.body = u;
    } catch (error) {
      // Bubble up the error to the global error handler
      throw error;
    }
  }
};
