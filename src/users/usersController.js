/**
 * @module usersController
 */

/* eslint-disable no-useless-catch */

const usersService = require('./usersService');

module.exports = {
  /**
   * Handles a show user request.
   * @function
   * @static
   * @async
   * @param {Object} ctx - The application context
   * @param {Function} _next - The downstream request handler
   */
  show: async (ctx, _next) => {
    try {
      // Fetch the user with the specified id
      const u = await usersService.find(ctx.params.user);

      // User exists, respond with the user
      ctx.status = 200;
      ctx.body = u;
    } catch (error) {
      // Bubble up the error to the global error handler
      throw error;
    }
  }
};
