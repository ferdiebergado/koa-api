const Koa = require('koa');
const router = require('koa-router')();
const logger = require('koa-logger');
const authRoute = require('./auth/routes');

const app = new Koa();
app.keys = [process.env.APP_KEY];

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500;
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
    console.log('sent error %s to the cloud', err.message);
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

app.use(authRoute.routes());
app.use(authRoute.allowedMethods());

module.exports = app;
