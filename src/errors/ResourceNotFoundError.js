class ResourceNotFound extends Error {
  constructor() {
    const message = 'Resource not found';
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResourceNotFound);
    }
    this.name = 'ResourceNotFound';
    this.statusCode = 404;
  }
}

module.exports = ResourceNotFound;
