class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message) { return new ApiError(message, 400); }
  static unauthorized(message = 'Unauthorized') { return new ApiError(message, 401); }
  static forbidden(message = 'Forbidden') { return new ApiError(message, 403); }
  static notFound(message = 'Not found') { return new ApiError(message, 404); }
  static conflict(message) { return new ApiError(message, 409); }
  static internal(message = 'Internal server error') { return new ApiError(message, 500); }
}

module.exports = ApiError;
