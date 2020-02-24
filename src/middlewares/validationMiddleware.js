/* eslint-disable no-useless-catch */
module.exports = {
  // Validates the request body/route parameter based on the supplied schema
  validate: (schema, param) => {
    return async (ctx, next) => {
      // Default to validating the request body
      let request = ctx.request.body;

      // If param argument is present, validate the route parameter
      // eslint-disable-next-line security/detect-object-injection
      if (param) request = { [param]: ctx.params[param] };

      try {
        await schema.validateAsync(request, {
          abortEarly: false
        });
        await next();
      } catch (error) {
        throw error;
      }
    };
  }
};
