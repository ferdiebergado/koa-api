/* eslint-disable no-useless-catch */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
const mailer = require('../mail');

const { PROTO, HOST, PORT } = process.env;
const authUrl = `${PROTO}://${HOST}:${PORT}/auth`;
const notFound = 'User not found';

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

      // Generate verification token
      const token = crypto.randomBytes(64).toString('hex');

      // Insert the new user into the database
      const createUser = {
        text:
          'INSERT INTO users (name, email, password, verification_token) VALUES ($1, $2, $3, $4) RETURNING id, created_at, updated_at',
        values: [name, email, hash, token]
      };
      const res = await db.query(createUser);

      // Send verification email
      const msg = {
        username: name,
        link: `${authUrl}/verify/${token}`
      };
      mailer.send(email, 'Verify your account', 'verification.njk', msg);

      // Return the new user
      const user = res.rows[0];
      return {
        id: user.id,
        name,
        email,
        verification_token: token,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    } catch (error) {
      // Bubble up the error to the global error handler
      throw error;
    }
  },

  verify: async token => {
    const client = await db.getClient2();
    try {
      const findUserByVerificationToken = {
        text: 'SELECT id FROM users WHERE verification_token = $1',
        values: [token]
      };
      const res = await client.query(findUserByVerificationToken);

      if (res.rowCount === 0) throw new Error(notFound);

      const user = res.rows[0];
      const activateUser = {
        text:
          'UPDATE users SET is_active = TRUE, email_verified_at = CURRENT_TIMESTAMP, verification_token = NULL WHERE id = $1',
        values: [user.id]
      };

      await client.query(activateUser);
      return 'Account successfully activated.';
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  },

  recoverPassword: async email => {
    const client = await db.getClient2();
    try {
      const token = crypto.randomBytes(64).toString('hex');
      const findUserByEmail = {
        text: 'SELECT id FROM users WHERE email = $1 AND is_active = TRUE AND deleted_at IS NULL',
        values: [email]
      };
      const users = await client.query(findUserByEmail);

      if (users.rowCount === 0) throw new Error(notFound);

      const updatePasswordResetToken = {
        text:
          'UPDATE users SET password_reset_token = $1 WHERE email = $2 AND is_active = TRUE AND deleted_at IS NULL',
        values: [token, email]
      };
      await client.query(updatePasswordResetToken);

      // Send verification email
      const msg = {
        link: `${authUrl}/password/reset/${token}`
      };
      mailer.send(email, 'Reset your password', 'recoverPassword.njk', msg);
      return {
        message: 'A password reset link was sent to your email.',
        token
      };
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  },

  resetPassword: async (password, token) => {
    const client = await db.getClient2();
    try {
      const findUserByToken = {
        text: 'SELECT id FROM users WHERE password_reset_token = $1',
        values: [token]
      };
      // @ts-ignore
      const users = await client.query(findUserByToken);

      if (users.rowCount === 0) throw new Error(notFound);

      const hash = await bcrypt.hash(password, 10);
      const updatePassword = {
        text: 'UPDATE users SET password = $1 WHERE password_reset_token = $2',
        values: [hash, token]
      };

      // @ts-ignore
      await client.query(updatePassword);
      return 'Password was reset.';
    } catch (error) {
      throw error;
    } finally {
      // @ts-ignore
      client.release();
    }
  }
};
