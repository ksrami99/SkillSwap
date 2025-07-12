# Error Handling System Documentation

## Overview

The SkillSwap backend now features a comprehensive error handling system that provides detailed, user-friendly error messages with proper categorization and debugging information.

## Key Improvements

### 1. Enhanced ApiError Class

The `ApiError` class now includes:
- **Static methods** for common error types (badRequest, unauthorized, notFound, etc.)
- **Error codes** for better categorization
- **Detailed metadata** including timestamps and additional context
- **Consistent structure** across all error responses

### 2. Global Error Handler Middleware

Located in `src/middlewares/error.middleware.js`, this middleware:
- **Automatically catches** all unhandled errors
- **Converts** different error types to standardized ApiError format
- **Handles** specific error types:
  - Mongoose validation errors
  - Duplicate key errors
  - JWT token errors
  - Zod validation errors
  - Database connection errors
- **Provides** detailed error responses with debugging information in development

### 3. Improved Validation Messages

Validation schemas now include:
- **Descriptive error messages** for each field
- **Specific validation rules** with clear explanations
- **User-friendly** feedback for common mistakes

### 4. Centralized Error Messages

All error messages are centralized in `src/utils/errorMessages.js` for:
- **Consistency** across the application
- **Easy maintenance** and updates
- **Localization** support in the future

## Error Response Format

All error responses now follow this consistent format:

```json
{
  "success": false,
  "message": "User-friendly error message",
  "errorCode": "ERROR_TYPE",
  "statusCode": 400,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/v1/users",
  "method": "POST",
  "details": {
    "field": "email",
    "value": "invalid@email"
  },
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "code": "invalid_string"
    }
  ]
}
```

## Usage Examples

### Creating Errors

```javascript
// Using static methods
throw ApiError.badRequest("Invalid input provided");
throw ApiError.unauthorized("Please log in to continue");
throw ApiError.notFound("User not found");
throw ApiError.conflict("Resource already exists");

// With additional details
throw ApiError.validationError(errors, "Validation failed");
throw ApiError.databaseError("Failed to save user", { operation: "create" });
```

### Error Categories

#### Authentication Errors (401, 403)
- Invalid credentials
- Missing/expired tokens
- Insufficient permissions

#### Validation Errors (422)
- Invalid input data
- Missing required fields
- Format violations

#### Resource Errors (404, 409)
- Not found resources
- Duplicate entries
- Conflict situations

#### Server Errors (500)
- Database failures
- Internal processing errors
- System failures

## Development vs Production

### Development Mode
- **Detailed error messages** with stack traces
- **Original error information** for debugging
- **Verbose logging** for troubleshooting

### Production Mode
- **Generic error messages** for security
- **No stack traces** exposed to clients
- **Minimal logging** for performance

## Best Practices

### 1. Use Static Methods
```javascript
// Good
throw ApiError.notFound("User not found");

// Avoid
throw new ApiError(404, "User not found");
```

### 2. Provide Context
```javascript
// Good
throw ApiError.conflict("Email already exists", {
  field: "email",
  value: email
});

// Avoid
throw ApiError.conflict("Conflict");
```

### 3. Use Descriptive Messages
```javascript
// Good
"Please provide a valid email address"

// Avoid
"Invalid email"
```

### 4. Handle Specific Cases
```javascript
if (err.name === "ValidationError") {
  // Handle Mongoose validation
} else if (err.code === 11000) {
  // Handle duplicate key
}
```

## Error Codes Reference

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `BAD_REQUEST` | Invalid request data | 400 |
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `CONFLICT` | Resource conflict | 409 |
| `VALIDATION_ERROR` | Input validation failed | 422 |
| `INTERNAL_ERROR` | Server error | 500 |
| `DATABASE_ERROR` | Database operation failed | 500 |

## Testing Error Handling

### Test Cases to Cover

1. **Authentication Errors**
   - Invalid tokens
   - Expired tokens
   - Missing tokens

2. **Validation Errors**
   - Invalid email formats
   - Password complexity requirements
   - Required field validation

3. **Resource Errors**
   - Non-existent users
   - Duplicate emails
   - Private profiles

4. **Permission Errors**
   - Accessing private profiles
   - Modifying others' data
   - Unauthorized operations

### Example Test

```javascript
describe('Error Handling', () => {
  it('should return proper error for invalid email', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: 'invalid-email',
        password: 'Password123'
      });

    expect(response.status).toBe(422);
    expect(response.body.errorCode).toBe('VALIDATION_ERROR');
    expect(response.body.message).toContain('valid email address');
  });
});
```

## Monitoring and Logging

### Error Logging
- All errors are logged with timestamps
- Stack traces are preserved in development
- Error context is captured for debugging

### Performance Monitoring
- Error rates can be tracked
- Response times for error handling
- Database error frequency

## Future Enhancements

1. **Error Tracking Integration**
   - Sentry or similar service integration
   - Error aggregation and analysis

2. **Localization Support**
   - Multi-language error messages
   - Locale-specific formatting

3. **Rate Limiting**
   - Error-based rate limiting
   - Abuse prevention

4. **Error Recovery**
   - Automatic retry mechanisms
   - Circuit breaker patterns

## Migration Guide

### From Old Error Handling

**Before:**
```javascript
throw new ApiError(400, "User already exists");
```

**After:**
```javascript
throw ApiError.conflict("An account with this email already exists", {
  field: "email",
  value: email
});
```

### Updating Controllers

1. Remove try-catch blocks (handled globally)
2. Use static error methods
3. Provide descriptive messages
4. Add relevant context

This improved error handling system provides a much better developer and user experience with clear, actionable error messages and comprehensive debugging information. 