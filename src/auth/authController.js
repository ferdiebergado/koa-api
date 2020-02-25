/**
 * @module authController
 */
/* eslint-disable no-useless-catch */

const authService = require('./authService');
const { resetPasswordSchema, tokenSchema } = require('./authSchemas');

/**
 * Handle a login request
 * @static
 * @async
 * @param {Object} ctx - The application context
 * @param {Function} _next - The downstream request handler
 * @throws {Error}
 * @returns {Promise} The http response object
 */
async function login(ctx, _next) {
  try {
    // check if the account exists
    const { email, password } = ctx.request.body;
    const { payload, signature } = await authService.login(email, password);

    // Account exists, set the jwt cookie
    ctx.cookies.set('fsbapp.session.id', signature);

    // Set status to OK
    ctx.status = 200;

    // respond with the access token
    ctx.body = { access_token: payload };
  } catch (error) {
    // Bubble up the error to the global error handler
    throw error;
  }
}

/**
 * Handle a registration request
 * @static
 * @async
 * @param {Object} ctx - The application context
 * @param {Function} _next - The downstream request handler
 * @throws {Error}
 * @returns {Promise} The http response object
 */
async function register(ctx, _next) {
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

/**
 * Handle a new user account verification request
 * @static
 * @async
 * @param {Object} ctx - The application context
 * @param {Function} _next - The downstream request handler
 * @throws {Error}
 * @returns {Promise} The http response object
 */
async function verify(ctx, _next) {
  try {
    const message = await authService.verify(ctx.params.token);
    ctx.status = 200;
    ctx.body = { message };
  } catch (error) {
    throw error;
  }
}

/**
 * Handle a password recovery request
 * @static
 * @async
 * @param {Object} ctx - The application context
 * @param {Function} _next - The downstream request handler
 * @throws {Error}
 * @returns {Promise} The http response object
 */
async function recoverPassword(ctx, _next) {
  try {
    const message = await authService.recoverPassword(ctx.request.body.email);
    ctx.status = 200;
    ctx.body = message;
  } catch (error) {
    throw error;
  }
}

/**
 * Handle a password reset request
 * @static
 * @async
 * @param {Object} ctx - The application context
 * @param {Function} _next - The downstream request handler
 * @throws {Error}
 * @returns {Promise} The http response object
 */
async function resetPassword(ctx, _next) {
  try {
    await tokenSchema.validateAsync({ token: ctx.params.token });
    await resetPasswordSchema.validateAsync(ctx.request.body, { abortEarly: false });
    const message = await authService.resetPassword(ctx.request.body.password, ctx.params.token);
    ctx.status = 200;
    ctx.body = { message };
  } catch (error) {
    throw error;
  }
}

// Expose the functions
module.exports = { login, register, verify, recoverPassword, resetPassword };
