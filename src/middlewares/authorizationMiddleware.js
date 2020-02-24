/* eslint-disable no-useless-catch */
const jwt = require('jsonwebtoken');

/**
 * Checks if the appropriate headers and cookies are set
 */
function authorize() {
  return async (ctx, next) => {
    try {
      // Check if X-Requested-With header is set to XMLHttpRequest
      const header = ctx.get('X-Requested-With');
      if (!header) ctx.throw(401);
      if (header !== 'XMLHttpRequest') ctx.throw(401);

      // Check for Authorization header
      const payload = ctx.get('Authorization');
      if (!payload) ctx.throw(401);

      // Check for the session cookie
      const signature = ctx.cookies.get('fsbapp.session.id');
      if (!signature) ctx.throw(401);

      // Assemble the jwt
      const token = `${payload}.${signature}`;

      // Verify if the jwt is valid or throw an error
      jwt.verify(token, process.env.APP_KEY, err => {
        if (err) throw err;
      });

      // Call the next handler
      await next();
    } catch (error) {
      // Bubble up the error to the global error handler
      throw error;
    }
  };
}

module.exports = { authorize };
