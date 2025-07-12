import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Generate Access and Refresh Tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) throw new ApiError(400, "User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateTokens(user._id);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json(new ApiResponse(201, { accessToken }, "User registered successfully"));
  } catch (err) {
    next(err);
  }
};

// Login existing user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ApiError(400, "Invalid email or password");
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json(new ApiResponse(200, { accessToken }, "Login successful"));
  } catch (err) {
    next(err);
  }
};

// Get logged-in user info
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) throw new ApiError(404, "User not found");

    res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (err) {
    next(err);
  }
};

// Refresh access token using refresh token
export const getAccessToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new ApiError(401, "No refresh token found");

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).json(new ApiResponse(200, { accessToken }, "Token refreshed"));
  } catch (err) {
    next(new ApiError(401, "Invalid refresh token"));
  }
};

// Logout user and clear cookie
export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
};
