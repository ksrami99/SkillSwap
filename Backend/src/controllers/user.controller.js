import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Get all public users with optional filtering
export const getAllPublicUsers = async (req, res, next) => {
  try {
    const { skill, availability } = req.query;
    const filter = { profileVisibility: "public" };

    if (skill) {
      filter.skillsOffered = { $regex: skill, $options: "i" };
    }
    if (availability) {
      filter.availability = availability;
    }

    const users = await User.find(filter).select("-password");
    res.status(200).json(new ApiResponse(200, users, "Users fetched"));
  } catch (err) {
    next(err);
  }
};

// Get a single user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user || user.profileVisibility === "private")
      throw new ApiError(404, "User not found");

    res.status(200).json(new ApiResponse(200, user, "User profile fetched"));
  } catch (err) {
    next(err);
  }
};

// Update logged-in user's profile
export const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated"));
  } catch (err) {
    next(err);
  }
};

// Toggle profile visibility
export const toggleProfileVisibility = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.profileVisibility =
      user.profileVisibility === "public" ? "private" : "public";
    await user.save();

    res.status(200).json(new ApiResponse(200, user, "Visibility updated"));
  } catch (err) {
    next(err);
  }
};

// Delete logged-in user's account
export const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json(new ApiResponse(200, null, "Account deleted"));
  } catch (err) {
    next(err);
  }
};
