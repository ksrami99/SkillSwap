class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "",
    errorCode = null,
    details = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.errorCode = errorCode;
    this.details = details;
    this.timestamp = new Date().toISOString();

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Static methods for common error types
  static badRequest(message = "Bad Request", details = null) {
    return new ApiError(400, message, [], "", "BAD_REQUEST", details);
  }

  static unauthorized(message = "Unauthorized", details = null) {
    return new ApiError(401, message, [], "", "UNAUTHORIZED", details);
  }

  static forbidden(message = "Forbidden", details = null) {
    return new ApiError(403, message, [], "", "FORBIDDEN", details);
  }

  static notFound(message = "Resource not found", details = null) {
    return new ApiError(404, message, [], "", "NOT_FOUND", details);
  }

  static conflict(message = "Resource conflict", details = null) {
    return new ApiError(409, message, [], "", "CONFLICT", details);
  }

  static validationError(errors = [], message = "Validation failed") {
    return new ApiError(422, message, errors, "", "VALIDATION_ERROR", { fields: errors });
  }

  static internalError(message = "Internal server error", details = null) {
    return new ApiError(500, message, [], "", "INTERNAL_ERROR", details);
  }

  static databaseError(message = "Database operation failed", details = null) {
    return new ApiError(500, message, [], "", "DATABASE_ERROR", details);
  }
}

export default ApiError;
