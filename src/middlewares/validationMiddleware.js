/* eslint-disable no-useless-catch */
module.exports = {
  // Validates the request body based on the supplied schema
  validate: schema => {
    return async (ctx, next) => {
      try {
        await schema.validateAsync(ctx.request.body, {
          abortEarly: false
        });
        await next();
      } catch (error) {
        throw error;
      }
    };
  }
};
