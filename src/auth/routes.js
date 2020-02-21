const Router = require('koa-router');
const body = require('koa-body');
const API = require('./api');

const router = new Router();

router.prefix('/auth');
router.post('/login', body(), API.login);

module.exports = router;
