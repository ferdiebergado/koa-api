const Router = require('koa-router');
const usersController = require('./usersController');

const router = new Router();

router.prefix('/users');
router.get('/:user', usersController.show);

module.exports = router;
