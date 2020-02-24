class ResourceNotFoundError extends Error {
  constructor() {
    const message = 'Resource not found';
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResourceNotFoundError);
    }
    this.name = 'ResourceNotFoundError';
    this.statusCode = 404;
  }
}

module.exports = ResourceNotFoundError;
