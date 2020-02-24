/* eslint-disable no-useless-catch */
const db = require('../db');
const ResourceNotFoundError = require('../errors/ResourceNotFoundError');

/**
 * Finds a user by id.
 * @function
 * @async
 * @param {number} id - The user id
 * @throws {ResourceNotFoundError|Error}
 * @returns {Promise} Promise contains the user object
 */
async function find(id) {
  try {
    // Check if a user with the specified id exists in the database
    const findUserById = {
      text:
        'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1 AND is_active = TRUE AND deleted_at IS NULL',
      values: [id]
    };
    const users = await db.query(findUserById);

    // User does not exist, throw custom error
    if (users.rowCount === 0) throw new ResourceNotFoundError();

    // User found, return the user
    return users.rows[0];
  } catch (error) {
    // Bubble up the error to the global error handler
    throw error;
  }
}

// Expose the function(s)
module.exports = {
  find
};
