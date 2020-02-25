/* eslint-disable no-useless-catch */
const authService = require('./authService');
const { resetPasswordSchema, tokenSchema } = require('./authSchemas');

/**
 * Handle a login request
 * @param {Object} ctx - The Koa context
 * @param {Function} _next - The downstream route handler
 */
async function login(ctx, _next) {
  try {
    // check if the account exists
    const { email, password } = ctx.request.body;
    const { payload, signature } = await authService.login(email, password);

    // Account exists, set the jwt cookie
    ctx.cookies.set('fsbapp.session.id', signature, {
      // signed: true,
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
}

/**
 * Handle a registration request
 * @param {Object} ctx - The Koa context
 * @param {Function} _next - The downstream route handler
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
 * @param {Object} ctx - The Koa context
 * @param {Function} _next - The downstream route handler
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
 * @param {Object} ctx - The Koa context
 * @param {Function} _next - The downstream route handler
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
 * @param {Object} ctx - The Koa context
 * @param {Function} _next - The downstream route handler
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

module.exports = { login, register, verify, recoverPassword, resetPassword };
