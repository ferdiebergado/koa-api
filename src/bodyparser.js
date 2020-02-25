/**
 * The request body parser
 * @module bodyparser
 */
const Body = require('koa-body');

const body = Body({
  urlencoded: false,
  text: false
});

module.exports = body;
