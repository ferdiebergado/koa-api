const Koa = require('koa');
const router = require('koa-router')();
const logger = require('koa-logger');
const { ValidationError } = require('@hapi/joi');
const authRouter = require('./auth');
const userRouter = require('./users');

const app = new Koa();
const { NODE_ENV, APP_KEY } = process.env;

const DEV = NODE_ENV !== 'production';

app.keys = [APP_KEY];

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500;

    if (err instanceof ValidationError) {
      ctx.status = 422;
      if (!DEV) {
        err.details.forEach(e => {
          delete e.type;
          delete e.context;
        });
      }
      ctx.body = {
        errors: err.details
      };
      return;
    }
    if (err.message === 'User not found') {
      ctx.status = 404;
    }
    ctx.body = {
      error: err.message
    };

    // since we handled this manually we'll
    // want to delegate to the regular app
    // level error handling as well so that
    // centralized still functions correctly.
    ctx.app.emit('error', err, ctx);
  }
});

// error handler
app.on('error', err => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(err);
  }
});

// Log requests
app.use(logger());

// Mount the routes
router.get('/', (ctx, _next) => {
  ctx.body = { message: 'API v.0.0.1' };
});
router.get('/error', (_ctx, _next) => {
  throw new Error('Error explicitly triggered.');
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

module.exports = app;
