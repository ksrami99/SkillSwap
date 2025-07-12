import ApiError from "../utils/ApiError.js";

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If it's not an ApiError, convert it to one
  if (!(err instanceof ApiError)) {
    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(val => ({
        field: val.path,
        message: val.message,
        value: val.value
      }));
      error = ApiError.validationError(errors, "Validation failed");
    }
    // Handle Mongoose duplicate key errors
    else if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      error = ApiError.conflict(
        `${field} '${value}' already exists`,
        { field, value }
      );
    }
    // Handle Mongoose cast errors (invalid ObjectId)
    else if (err.name === "CastError") {
      error = ApiError.badRequest(
        `Invalid ${err.path}: ${err.value}`,
        { field: err.path, value: err.value }
      );
    }
    // Handle JWT errors
    else if (err.name === "JsonWebTokenError") {
      error = ApiError.unauthorized("Invalid token");
    }
    else if (err.name === "TokenExpiredError") {
      error = ApiError.unauthorized("Token expired");
    }
    // Handle Zod validation errors
    else if (err.name === "ZodError") {
      const errors = err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
        code: e.code
      }));
      error = ApiError.validationError(errors, "Validation failed");
    }
    // Handle other known errors
    else if (err.name === "SyntaxError" && err.status === 400) {
      error = ApiError.badRequest("Invalid JSON format");
    }
    // Default to internal server error
    else {
      error = ApiError.internalError(
        process.env.NODE_ENV === "development" ? err.message : "Internal server error",
        process.env.NODE_ENV === "development" ? { stack: err.stack } : null
      );
    }
  }

  // Prepare error response
  const errorResponse = {
    success: false,
    message: error.message,
    errorCode: error.errorCode,
    statusCode: error.statusCode,
    timestamp: error.timestamp,
    path: req.originalUrl,
    method: req.method,
    ...(error.details && { details: error.details }),
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
      originalError: err.message
    })
  };

  // Log error for debugging
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${error.statusCode}: ${error.message}`);
  
  if (process.env.NODE_ENV === "development") {
    console.error("Stack trace:", error.stack);
  }

  return res.status(error.statusCode).json(errorResponse);
};

// 404 handler for undefined routes
export const notFoundHandler = (req, res, next) => {
  const error = ApiError.notFound(`Route ${req.originalUrl} not found`);
  next(error);
};

// Async error wrapper
export const asyncErrorHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 