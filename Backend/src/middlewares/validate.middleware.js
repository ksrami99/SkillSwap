import ApiError from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err.name === "ZodError") {
      const errors = err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
        code: e.code,
        received: e.received
      }));
      
      // Create a more user-friendly message
      const fieldMessages = errors.map(e => `${e.field}: ${e.message}`).join(', ');
      const message = `Validation failed: ${fieldMessages}`;
      
      return next(ApiError.validationError(errors, message));
    }
    
    // Fallback for other validation errors
    const message = err.errors?.[0]?.message || "Validation error";
    return next(ApiError.badRequest(message));
  }
};
