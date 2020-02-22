const http = require('http');
const app = require('./app');

const { PORT, HOST, PROTO } = process.env;
const port = PORT || 3000;
const host = HOST || 'localhost';

const server = http.createServer(app.callback()).listen(port, host, err => {
  if (err) console.error(err);
  console.log(`Listening on ${PROTO}://${host}:${port}`);
});

module.exports = server;
