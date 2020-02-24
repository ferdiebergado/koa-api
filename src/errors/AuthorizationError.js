class AuthorizationError extends Error {
  constructor() {
    const message = 'Please login to access the resource';
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthorizationError);
    }
    this.name = 'AuthorizationError';
    this.statusCode = 401;
  }
}

module.exports = AuthorizationError;
