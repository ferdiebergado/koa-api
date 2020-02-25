/**
 * The authentication endpoints
 * @module authAPI
 */

/**
 * @constant {Object}
 * @description The authentication router
 */
const router = require('@koa/router')();
const body = require('../bodyparser');
const { loginSchema, registerSchema, tokenSchema, passwordResetSchema } = require('./authSchemas');
const { validate } = require('../middlewares/validationMiddleware');
const { login, register, verify, recoverPassword, resetPassword } = require('./authController');

router.prefix('/auth');
router.post('/login', body, validate(loginSchema), login);
router.post('/register', body, validate(registerSchema), register);
router.get('/verify/:token', validate(tokenSchema, 'token'), verify);
router.post('/password/reset/:token', body, resetPassword);
router.post('/password/recover', body, validate(passwordResetSchema), recoverPassword);

// Expose the router
module.exports = router;
