const Koa = require("koa");
const body = require("koa-body");
const router = require("koa-router")();
const app = (module.exports = new Koa());
app.keys = [process.env.APP_KEY];

app.use(async function(ctx, next) {
  try {
    await next();
  } catch (err) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message
    };

    // since we handled this manually we'll
    // want to delegate to the regular app
    // level error handling as well so that
    // centralized still functions correctly.
    ctx.app.emit("error", err, ctx);
  }
});

router.get("/", (ctx, next) => (ctx.body = { message: "API v.0.0.1" }));
router.get("/error", (ctx, next) => {
  throw new Error("Error explicitly triggered.");
});
app.use(body());
app.use(router.routes());

// error handler
app.on("error", function(err) {
  if (process.env.NODE_ENV != "test") {
    console.log("sent error %s to the cloud", err.message);
    console.log(err);
  }
});
