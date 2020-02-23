/* eslint-disable no-useless-catch */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

module.exports = {
  login: async (email, password) => {
    try {
      // Check if a user with the specified email exists in the database
      const findUserByEmail = {
        text:
          'SELECT id, name, email, role, password FROM users WHERE email = $1 AND is_active = TRUE AND deleted_at IS NULL',
        values: [email]
      };
      const users = await db.query(findUserByEmail);
      const notFound = 'User not found';

      // User does not exist, throw custom error
      if (users.rowCount === 0) throw new Error(notFound);

      // User exists, check if supplied password match the hashed password in the database
      const user = users.rows[0];
      const match = await bcrypt.compare(password, user.password);

      // Passwords did not match, throw custom error
      if (!match) throw new Error(notFound);

      // Passwords match, create a jwt
      delete user.password;
      const token = jwt.sign(user, process.env.APP_KEY, { expiresIn: 1800 });

      // Split the jwt (for csrf protection)
      const jwtStr = token.split('.');

      // Return the split jwt
      return {
        payload: `${jwtStr[0]}.${jwtStr[1]}`,
        signature: jwtStr[2]
      };
    } catch (error) {
      // Bubble up the error to the global error handler
      throw error;
    }
  },
  register: async data => {
    try {
      // Get the creds from the function parameter
      const { name, email, password } = data;

      // Hash the password
      const hash = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      const createUser = {
        text:
          'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, created_at, updated_at',
        values: [name, email, hash]
      };
      const res = await db.query(createUser);

      // Return the new user
      const user = res.rows[0];
      return {
        id: user.id,
        name,
        email,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    } catch (error) {
      // Bubble up the error to the global error handler
      throw error;
    }
  }
};
