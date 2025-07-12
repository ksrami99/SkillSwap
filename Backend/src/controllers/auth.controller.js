import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw ApiError.conflict("An account with this email already exists", {
      field: "email",
      value: email
    });
  }

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
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .status(201)
    .json(
      new ApiResponse(201, { accessToken }, "Account created successfully! Welcome to SkillSwap")
    );
});

// Login existing user
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password. Please check your credentials and try again.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid email or password. Please check your credentials and try again.");
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(new ApiResponse(200, { accessToken }, "Login successful! Welcome back"));
});

// Get logged-in user info
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    throw ApiError.notFound("User account not found. Please log in again.");
  }

  // Map profileVisibility to isPublic for frontend compatibility
  const userResponse = user.toObject();
  userResponse.isPublic = userResponse.profileVisibility === "public";

  res
    .status(200)
    .json(new ApiResponse(200, userResponse, "User profile retrieved successfully"));
});

// Refresh access token using refresh token
export const getAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw ApiError.unauthorized("No refresh token found. Please log in again.");
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res
      .status(200)
      .json(new ApiResponse(200, { accessToken }, "Access token refreshed successfully"));
  } catch (err) {
    throw ApiError.unauthorized("Invalid or expired refresh token. Please log in again.");
  }
});

// Logout user and clear cookie
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully. See you next time!"));
});

// Update user profile
export const updateProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  
  // Map isPublic to profileVisibility for frontend compatibility
  if (updates.isPublic !== undefined) {
    updates.profileVisibility = updates.isPublic ? "public" : "private";
    delete updates.isPublic;
  }
  
  // Check if user exists before updating
  const existingUser = await User.findById(req.user.id);
  if (!existingUser) {
    throw ApiError.notFound("User account not found. Please log in again.");
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  // Map profileVisibility back to isPublic for frontend compatibility
  const userResponse = updatedUser.toObject();
  userResponse.isPublic = userResponse.profileVisibility === "public";

  res.status(200).json(
    new ApiResponse(200, userResponse, "Profile updated successfully")
  );
});
