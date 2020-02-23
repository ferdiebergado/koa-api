const Body = require('koa-body');

module.exports = () => {
  return new Body({
    urlencoded: false,
    text: false
  });
};
