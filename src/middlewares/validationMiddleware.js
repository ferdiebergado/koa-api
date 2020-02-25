/* eslint-disable no-useless-catch */
/**
 * Validate the request body/route parameter based on the supplied schema
 *
 * @param {Object} schema - The validation schema
 * @param {string} param - If set, validates the route parameter with the set name
 */
function validate(schema, param = null) {
  return async (ctx, next) => {
    try {
      // Default to validating the request body
      let request = ctx.request.body;

      // If param argument is set, validate the route parameter
      // eslint-disable-next-line security/detect-object-injection
      if (param) request = { [param]: ctx.params[param] };

      // Validate
      await schema.validateAsync(request, {
        abortEarly: false
      });

      // Call the next route handler
      await next();
    } catch (error) {
      // Bubble up the error to the global error handler
      throw error;
    }
  };
}

module.exports = { validate };
