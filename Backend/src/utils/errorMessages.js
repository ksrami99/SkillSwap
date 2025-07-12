// Authentication Error Messages
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password. Please check your credentials and try again.",
  EMAIL_EXISTS: "An account with this email already exists.",
  USER_NOT_FOUND: "User account not found. Please log in again.",
  TOKEN_REQUIRED: "Access token is required. Please log in to continue.",
  TOKEN_MISSING: "Access token is missing. Please log in to continue.",
  TOKEN_EXPIRED: "Access token has expired. Please refresh your token or log in again.",
  TOKEN_INVALID: "Invalid access token. Please log in again.",
  TOKEN_FORMAT: "Invalid authorization format. Please use 'Bearer <token>'.",
  REFRESH_TOKEN_MISSING: "No refresh token found. Please log in again.",
  REFRESH_TOKEN_INVALID: "Invalid or expired refresh token. Please log in again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied. You don't have permission to perform this action.",
};

// User Error Messages
export const USER_ERRORS = {
  PROFILE_NOT_FOUND: "User profile not found. The user may have deleted their account or made their profile private.",
  PROFILE_PRIVATE: "This user's profile is private and cannot be viewed.",
  ACCOUNT_NOT_FOUND: "User account not found. Please log in again.",
  NO_USERS_FOUND: "No users found matching your criteria.",
  PROFILE_UPDATE_FAILED: "Failed to update profile. Please try again.",
  ACCOUNT_DELETE_SUCCESS: "Account deleted successfully. We're sorry to see you go!",
};

// Swap Request Error Messages
export const SWAP_ERRORS = {
  SELF_REQUEST: "You cannot send a swap request to yourself.",
  TARGET_USER_NOT_FOUND: "The user you're trying to contact doesn't exist or has deleted their account.",
  TARGET_USER_PRIVATE: "This user's profile is private and cannot receive swap requests.",
  REQUEST_EXISTS: "You already have a pending swap request with this user. Please wait for their response.",
  REQUEST_NOT_FOUND: "Swap request not found. It may have been deleted or doesn't exist.",
  REQUEST_ALREADY_PROCESSED: "This request has already been processed and cannot be modified.",
  REQUEST_DELETE_FORBIDDEN: "You can only delete swap requests that you sent.",
  REQUEST_RESPOND_FORBIDDEN: "You can only respond to swap requests sent to you.",
  REQUEST_DELETE_PROCESSED: "Only pending requests can be deleted. This request has already been processed.",
  NO_REQUESTS_FOUND: "You don't have any swap requests yet.",
  REQUEST_SENT_SUCCESS: "Swap request sent successfully! The user will be notified.",
  REQUEST_ACCEPTED: "Swap request accepted successfully",
  REQUEST_DECLINED: "Swap request declined successfully",
  REQUEST_DELETED: "Swap request deleted successfully",
};

// Feedback Error Messages
export const FEEDBACK_ERRORS = {
  SELF_FEEDBACK: "You cannot give feedback to yourself.",
  SWAP_NOT_FOUND: "Swap request not found. It may have been deleted or doesn't exist.",
  SWAP_NOT_ACCEPTED: "You can only give feedback for completed swaps that were accepted.",
  SWAP_NOT_PARTICIPANT: "You can only give feedback for swaps you participated in.",
  FEEDBACK_EXISTS: "You have already submitted feedback for this swap.",
  NO_FEEDBACK_FOUND: "No feedback found for this user yet.",
  FEEDBACK_SUBMITTED: "Feedback submitted successfully! Thank you for your review.",
};

// Validation Error Messages
export const VALIDATION_ERRORS = {
  NAME_MIN_LENGTH: "Name must be at least 2 characters long",
  NAME_MAX_LENGTH: "Name cannot exceed 50 characters",
  NAME_FORMAT: "Name can only contain letters and spaces",
  EMAIL_INVALID: "Please provide a valid email address",
  PASSWORD_MIN_LENGTH: "Password must be at least 6 characters long",
  PASSWORD_MAX_LENGTH: "Password cannot exceed 100 characters",
  PASSWORD_COMPLEXITY: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  PASSWORD_REQUIRED: "Password is required",
  LOCATION_MIN_LENGTH: "Location must be at least 2 characters long",
  LOCATION_MAX_LENGTH: "Location cannot exceed 100 characters",
  PROFILE_PHOTO_INVALID: "Please provide a valid URL for profile photo",
  SKILLS_MIN_COUNT: "At least one skill must be offered",
  SKILLS_MAX_COUNT: "Cannot offer more than 10 skills",
  WANTED_SKILLS_MIN_COUNT: "At least one skill must be wanted",
  WANTED_SKILLS_MAX_COUNT: "Cannot want more than 10 skills",
  AVAILABILITY_INVALID: "Availability must be one of: weekdays, weekends, evenings, mornings, anytime",
  BIO_MAX_LENGTH: "Bio cannot exceed 500 characters",
  VISIBILITY_INVALID: "Profile visibility must be either 'public' or 'private'",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required",
};

// General Error Messages
export const GENERAL_ERRORS = {
  INTERNAL_ERROR: "Internal server error. Please try again later.",
  NOT_FOUND: "Resource not found.",
  BAD_REQUEST: "Bad request. Please check your input and try again.",
  CONFLICT: "Resource conflict. The requested operation cannot be completed.",
  VALIDATION_FAILED: "Validation failed. Please check your input and try again.",
  DATABASE_ERROR: "Database operation failed. Please try again later.",
  JSON_INVALID: "Invalid JSON format. Please check your request body.",
  ROUTE_NOT_FOUND: "Route not found. Please check the URL and try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: "Account created successfully! Welcome to SkillSwap",
  LOGIN_SUCCESS: "Login successful! Welcome back",
  LOGOUT_SUCCESS: "Logged out successfully. See you next time!",
  PROFILE_RETRIEVED: "User profile retrieved successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  TOKEN_REFRESHED: "Access token refreshed successfully",
  USERS_FETCHED: "Users retrieved successfully",
  USER_FETCHED: "User profile retrieved successfully",
  VISIBILITY_UPDATED: "Profile visibility updated successfully",
  ACCOUNT_DELETED: "Account deleted successfully. We're sorry to see you go!",
  SWAP_REQUEST_SENT: "Swap request sent successfully! The user will be notified.",
  SWAP_REQUESTS_FETCHED: "Swap requests retrieved successfully",
  SWAP_REQUEST_ACCEPTED: "Swap request accepted successfully",
  SWAP_REQUEST_DECLINED: "Swap request declined successfully",
  SWAP_REQUEST_DELETED: "Swap request deleted successfully",
  FEEDBACK_SUBMITTED: "Feedback submitted successfully! Thank you for your review.",
  FEEDBACK_FETCHED: "Feedback retrieved successfully",
}; 