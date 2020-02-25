/**
 * @module db
 */
/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-catch */

const { Pool } = require('pg');

const pool = new Pool();

const { NODE_ENV } = process.env;
const DEV = NODE_ENV !== 'production';

/**
 * Execute a query on the database pool.
 * @static
 * @async
 * @param {Object} sql - The object containing the query string and values.
 * @param {string} sql.text - The query string.
 * @param {array} sql.values - The query parameter(s)
 * @throws {Error}
 * @returns {Promise} The query result
 */
async function query(sql) {
  try {
    let res;
    if (DEV) {
      const start = Date.now();
      res = await pool.query(sql);
      const duration = Date.now() - start;
      const { text, values } = sql;
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
}

/**
 * Get the client from the connection pool.
 * @static
 * @async
 * @throws {Error}
 * @returns {Promise} The client
 */
async function getClient() {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    // Bubble up the error to the global error handler
    throw error;
  }
}

// Expose the functions
module.exports = {
  query,
  getClient
};
