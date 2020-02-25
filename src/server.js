/**
 * The http server
 * @module server
 */
const http = require('http');
const app = require('./app');

const { PORT, HOST } = process.env;
const port = PORT || 3000;
const host = HOST || 'localhost';

const server = http.createServer(app.callback()).listen(port, host, err => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Listening on ${host}:${port}`);
  }
});

module.exports = server;
