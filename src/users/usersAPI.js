const router = require('koa-router')();
const usersController = require('./usersController');
const { showSchema } = require('./usersSchema');
const { validate } = require('../middlewares/validationMiddleware');

router.prefix('/users');
router.get('/:user', validate(showSchema), usersController.show);

module.exports = router;
