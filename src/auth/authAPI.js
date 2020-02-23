const router = require('koa-router')();
const body = require('../bodyparser');
const authController = require('./authController');

router.prefix('/auth');
router.post('/login', body(), authController.login);
router.post('/register', body(), authController.register);

module.exports = router;
