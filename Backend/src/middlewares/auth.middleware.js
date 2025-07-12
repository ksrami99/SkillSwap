import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return next(new ApiError(401, "Unauthorized"));

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid token"));
  }
};

export default verifyToken;