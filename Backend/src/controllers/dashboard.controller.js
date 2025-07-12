import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { SwapRequest } from "../models/swapRequest.model.js";
import { Feedback } from "../models/feedback.model.js";

const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get total requests (sent and received)
  const totalRequests = await SwapRequest.countDocuments({
    $or: [{ requester: userId }, { recipient: userId }]
  });

  // Get pending requests
  const pendingRequests = await SwapRequest.countDocuments({
    $or: [{ requester: userId }, { recipient: userId }],
    status: "pending"
  });

  // Get completed swaps
  const completedSwaps = await SwapRequest.countDocuments({
    $or: [{ requester: userId }, { recipient: userId }],
    status: "accepted"
  });

  // Get average rating
  const userFeedbacks = await Feedback.find({ recipient: userId });
  const averageRating = userFeedbacks.length > 0 
    ? userFeedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / userFeedbacks.length 
    : 0;

  const stats = {
    totalRequests,
    pendingRequests,
    completedSwaps,
    averageRating
  };

  return res.status(200).json(
    new ApiResponse(200, stats, "Dashboard stats retrieved successfully")
  );
});

const getRecentRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get recent swap requests (both sent and received)
  const recentRequests = await SwapRequest.find({
    $or: [{ requester: userId }, { recipient: userId }]
  })
  .populate("requester", "name profilePhoto")
  .populate("recipient", "name profilePhoto")
  .sort({ createdAt: -1 })
  .limit(5);

  // Format the response to include fromUser field
  const formattedRequests = recentRequests.map(request => ({
    _id: request._id,
    status: request.status,
    offeredSkill: request.offeredSkill,
    requestedSkill: request.requestedSkill,
    createdAt: request.createdAt,
    fromUser: request.requester._id.equals(userId) ? request.recipient : request.requester,
    toUser: request.requester._id.equals(userId) ? request.requester : request.recipient
  }));

  return res.status(200).json(
    new ApiResponse(200, formattedRequests, "Recent requests retrieved successfully")
  );
});

export {
  getDashboardStats,
  getRecentRequests
}; 