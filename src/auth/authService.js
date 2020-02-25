/**
 * @module authService
 */

/* eslint-disable no-useless-catch */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
const mailer = require('../mail');
const ResourceNotFoundError = require('../errors/ResourceNotFoundError');

const { PROTO, HOST, PORT, APP_KEY } = process.env;
const authUrl = `${PROTO}://${HOST}:${PORT}/auth`;

/**
 * Logs in the user.
 * @static
 * @async
 * @param {string} email - The user email address.
 * @param {string} password - The user password.
 * @throws {Error}
 * @returns {Promise} Promise object representing the user jwt.
 */
async function login(email, password) {
  try {
    // Check if a user with the specified email exists in the database
    const findUserByEmail = {
      text:
        'SELECT id, name, email, role, password FROM users WHERE email = $1 AND is_active = TRUE AND deleted_at IS NULL',
      values: [email]
    };
    const users = await db.query(findUserByEmail);

    // User does not exist, throw an error
    if (users.rowCount === 0) throw new ResourceNotFoundError();

    // User exists, check if supplied password match the hashed password in the database
    const user = users.rows[0];
    const match = await bcrypt.compare(password, user.password);

    // Passwords did not match, throw an error
    if (!match) throw new ResourceNotFoundError();

    // Passwords match, create a jwt
    delete user.password;
    const token = jwt.sign(user, APP_KEY, { expiresIn: 1800 });

    // Split the jwt (for csrf protection)
    const jwtStr = token.split('.');

    // Return an object containing the split jwt
    return {
      payload: `${jwtStr[0]}.${jwtStr[1]}`,
      signature: jwtStr[2]
    };
  } catch (error) {
    // Bubble up the error to the global error handler
    throw error;
  }
}

/**
 * Registers a user.
 * @static
 * @async
 * @param {Object} data - The new user.
 * @param {string} data.name - The name of the user.
 * @param {string} data.email - The email address of the user.
 * @param {string} data.password - The password of the user.
 * @throws {Error}
 * @returns {Promise} Promise object represents the new user.
 */
async function register(data) {
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

    // Return an object representing the new user
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
}

/**
 * Verifies a newly created user account using a token.
 * @static
 * @async
 * @param {string} token - The verification token.
 * @throws {Error}
 * @returns {Promise} Promise object contains the string message.
 */
async function verify(token) {
  const client = await db.getClient();
  try {
    // Check if a user with the supplied token exists in the database
    const findUserByVerificationToken = {
      text: 'SELECT id FROM users WHERE verification_token = $1',
      values: [token]
    };
    const res = await client.query(findUserByVerificationToken);

    // User does not exist, throw an error
    if (res.rowCount === 0) throw new ResourceNotFoundError();

    // User exists, activate the user
    const user = res.rows[0];
    const activateUser = {
      text:
        'UPDATE users SET is_active = TRUE, email_verified_at = CURRENT_TIMESTAMP, verification_token = NULL WHERE id = $1',
      values: [user.id]
    };

    await client.query(activateUser);

    // Return success message
    return 'Account successfully activated.';
  } catch (error) {
    // Bubble up the error to the global error handler
    throw error;
  } finally {
    // Release the database client
    client.release();
  }
}

/**
 * Send a password recovery link to the specified email.
 * @static
 * @async
 * @param {string} email - The email address of the user.
 * @throws {Error}
 * @returns {Promise} Promise object represents the string message and password recovery token
 */
async function recoverPassword(email) {
  const client = await db.getClient();
  try {
    // Generate a password recovery token
    const token = crypto.randomBytes(64).toString('hex');

    // Check if a user with the specified email exists in the database
    const findUserByEmail = {
      text: 'SELECT id FROM users WHERE email = $1 AND is_active = TRUE AND deleted_at IS NULL',
      values: [email]
    };
    const users = await client.query(findUserByEmail);

    // User not found, throw an error
    if (users.rowCount === 0) throw new ResourceNotFoundError();

    // User exists, assign the password reset token to the user
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

    // Return an object containing the success message and the password reset token
    return {
      message: 'A password reset link was sent to your email.',
      token
    };
  } catch (error) {
    // Bubble up the error to the global error handler
    throw error;
  } finally {
    // Release the database client
    client.release();
  }
}

/**
 * Resets the user password.
 * @static
 * @async
 * @param {string} password - The new password.
 * @param {string} token - The password recovery token.
 * @throws {Error}
 * @returns {Promise} Promise object represents the string message.
 */
async function resetPassword(password, token) {
  const client = await db.getClient();
  try {
    // Check if a user with the supplied token exists in the database
    const findUserByToken = {
      text: 'SELECT id FROM users WHERE password_reset_token = $1',
      values: [token]
    };
    // @ts-ignore
    const users = await client.query(findUserByToken);

    // User not found, throw an error
    if (users.rowCount === 0) throw new ResourceNotFoundError();

    // User exists, hash the password
    const hash = await bcrypt.hash(password, 10);

    // Update the user password
    const updatePassword = {
      text: 'UPDATE users SET password = $1 WHERE password_reset_token = $2',
      values: [hash, token]
    };
    // @ts-ignore
    await client.query(updatePassword);

    // Return the success message
    return 'Password was reset.';
  } catch (error) {
    // Bubble up the error to the global error handler
    throw error;
  } finally {
    // Release the database client
    // @ts-ignore
    client.release();
  }
}

// expose the functions
module.exports = {
  login,
  register,
  verify,
  recoverPassword,
  resetPassword
};
