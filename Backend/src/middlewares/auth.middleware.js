import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(ApiError.unauthorized("Access token is required. Please log in to continue."));
  }

  if (!authHeader.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Invalid authorization format. Please use 'Bearer <token>'."));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(ApiError.unauthorized("Access token is missing. Please log in to continue."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Access token has expired. Please refresh your token or log in again."));
    }
    if (err.name === "JsonWebTokenError") {
      return next(ApiError.unauthorized("Invalid access token. Please log in again."));
    }
    return next(ApiError.unauthorized("Token verification failed. Please log in again."));
  }
};

export default verifyToken;