import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SwapRequest } from "../models/swapRequest.model.js";

// Get all public users with optional filtering
export const getAllPublicUsers = asyncHandler(async (req, res) => {
  const { skill, availability } = req.query;
  const filter = { profileVisibility: "public" };

  if (skill) {
    filter.skillsOffered = { $regex: skill, $options: "i" };
  }
  if (availability) {
    filter.availability = availability;
  }

  const users = await User.find(filter).select("-password");
  
  // Map profileVisibility to isPublic for frontend compatibility
  const usersWithIsPublic = users.map(user => {
    const userObj = user.toObject();
    userObj.isPublic = userObj.profileVisibility === "public";
    return userObj;
  });
  
  if (usersWithIsPublic.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, [], "No users found matching your criteria")
    );
  }

  res.status(200).json(
    new ApiResponse(200, usersWithIsPublic, `Found ${usersWithIsPublic.length} user(s) matching your criteria`)
  );
});

// Get a single user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id || req.user.id;
  const user = await User.findById(userId).select("-password");
  
  if (!user) {
    throw ApiError.notFound("User profile not found. The user may have deleted their account or made their profile private.");
  }
  
  // Map profileVisibility to isPublic for frontend compatibility
  const userResponse = user.toObject();
  userResponse.isPublic = userResponse.profileVisibility === "public";
  
  // If user is requesting their own profile, allow access regardless of visibility
  if (userId === req.user.id) {
    return res.status(200).json(
      new ApiResponse(200, userResponse, "User profile retrieved successfully")
    );
  }
  
  if (user.profileVisibility === "private") {
    throw ApiError.forbidden("This user's profile is private and cannot be viewed.");
  }

  res.status(200).json(
    new ApiResponse(200, userResponse, "User profile retrieved successfully")
  );
});

// Update logged-in user's profile
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

// Toggle profile visibility
export const toggleProfileVisibility = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw ApiError.notFound("User account not found. Please log in again.");
  }

  const newVisibility = user.profileVisibility === "public" ? "private" : "public";
  user.profileVisibility = newVisibility;
  await user.save();

  const visibilityText = newVisibility === "public" ? "public" : "private";
  res.status(200).json(
    new ApiResponse(200, user, `Profile is now ${visibilityText}`)
  );
});

// Delete logged-in user's account
export const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw ApiError.notFound("User account not found.");
  }

  await User.findByIdAndDelete(req.user.id);
  
  res.status(200).json(
    new ApiResponse(200, null, "Account deleted successfully. We're sorry to see you go!")
  );
});

// Get platform statistics
export const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeSwaps = await SwapRequest.countDocuments({ status: "accepted" });

  const stats = {
    totalUsers,
    activeSwaps
  };

  res.status(200).json(
    new ApiResponse(200, stats, "Platform statistics retrieved successfully")
  );
});
