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

      // Passwords match, issue an access token with corresponding cookie
      delete user.password;
      const token = jwt.sign(user, process.env.APP_KEY, { expiresIn: 1800 });
      const jwtStr = token.split('.');
      return {
        payload: `${jwtStr[0]}.${jwtStr[1]}`,
        signature: jwtStr[2]
      };
    } catch (error) {
      // Bubble up the error to the global error handler
      throw error;
    }
  }
};
