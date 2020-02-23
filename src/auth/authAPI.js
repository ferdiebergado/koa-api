const router = require('koa-router')();
const body = require('../bodyparser');
const API = require('./authController');

router.prefix('/auth');
router.post('/login', body(), API.login);
router.post('/register', body(), API.register);

module.exports = router;
