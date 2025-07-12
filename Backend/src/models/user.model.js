import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't return password by default
    },
    location: {
      type: String,
    },
    profilePhoto: {
      type: String, // Cloudinary URL
    },
    skillsOffered: {
      type: [String],
      default: [],
    },
    skillsWanted: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      enum: ["weekdays", "weekends", "evenings", "mornings", "anytime"],
      default: "anytime",
    },
    profileVisibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    rating: {
      type: Number,
      default: 0,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
