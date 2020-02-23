const router = require('koa-router')();
const body = require('../bodyparser');
const { loginSchema, registerSchema } = require('./authSchemas');
const { validate } = require('../middlewares/validationMiddleware');
const authController = require('./authController');

router.prefix('/auth');
router.post('/login', body(), validate(loginSchema), authController.login);
router.post('/register', body(), validate(registerSchema), authController.register);

module.exports = router;
