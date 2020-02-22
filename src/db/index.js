/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-catch */
const { Pool } = require('pg');

const pool = new Pool();

const { NODE_ENV } = process.env;
const DEV = NODE_ENV === 'development';

module.exports = {
  query: async query => {
    try {
      let res;
      if (DEV) {
        const start = Date.now();
        res = await pool.query(query);
        const duration = Date.now() - start;
        const { text, values } = query;
        let numrows = 0;
        if (res !== null && typeof res !== 'undefined') {
          numrows = res.rowCount;
        }
        console.log('executed query', {
          text,
          values,
          duration,
          rows: numrows
        });
      } else {
        res = await pool.query(query);
      }
      return res;
    } catch (error) {
      throw error;
    }
  },

  getClient: callback => {
    pool.connect((err, client, done) => {
      const { query } = client;
      // monkey patch the query method to keep track of the last query executed
      client.query = (...args) => {
        client.lastQuery = args;
        return query.apply(client, args);
      };
      // set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!');
        console.error(`The last executed query on this client was: ${client.lastQuery}`);
      }, 5000);
      const release = error => {
        // call the actual 'done' method, returning this client to the pool
        done(error);
        // clear our timeout
        clearTimeout(timeout);
        // set the query method back to its old un-monkey-patched version
        client.query = query;
      };
      callback(err, client, release);
    });
  },

  getClient2: async () => {
    return pool.connect();
  }
};
