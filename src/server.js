const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const server = http.createServer(app.callback()).listen(PORT, HOST, err => {
  if (err) console.error(err);
  console.log(`Listening on ${process.env.PROTO}://${HOST}:${PORT}`);
});

module.exports = server;
