const Router = require('koa-router');
const API = require('./api');

const router = new Router();

router.prefix('/users');
router.get('/:user', API.show);

module.exports = router;
