/**
 * The users API endpoint.
 * @module usersAPI
 */

/**
 * @constant {Object}
 * @description The users router.
 */
const router = require('@koa/router')();
const usersController = require('./usersController');
const { showSchema } = require('./usersSchema');
const { validate } = require('../middlewares/validationMiddleware');
const { authorize } = require('../middlewares/authorizationMiddleware');

router.prefix('/users');
router.get('/:user', validate(showSchema, 'user'), authorize(), usersController.show);

// Expose the router
module.exports = router;
