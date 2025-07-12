import Feedback from "../models/feedback.model.js";
import SwapRequest from "../models/swapRequest.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const giveFeedback = asyncHandler(async (req, res) => {
  const { userId, swapId } = req.params;
  const { rating, comment } = req.body;

  if (req.user.id === userId) {
    throw ApiError.badRequest("You cannot give feedback to yourself.");
  }

  // If swapId is provided, validate the swap
  if (swapId) {
    const swap = await SwapRequest.findById(swapId);
    if (!swap) {
      throw ApiError.notFound("Swap request not found. It may have been deleted or doesn't exist.");
    }
    
    if (swap.status !== "accepted") {
      throw ApiError.badRequest("You can only give feedback for completed swaps that were accepted.");
    }

    // Check if user is part of this swap
    if (swap.requester.toString() !== req.user.id && swap.recipient.toString() !== req.user.id) {
      throw ApiError.forbidden("You can only give feedback for swaps you participated in.");
    }
  }

  const alreadyGiven = await Feedback.findOne({
    from: req.user.id,
    to: userId,
    swapId: swapId || null,
  });
  
  if (alreadyGiven) {
    throw ApiError.conflict("You have already submitted feedback for this user.");
  }

  const feedback = await Feedback.create({
    from: req.user.id,
    to: userId,
    swapId: swapId || null,
    rating,
    comment,
  });

  res.status(201).json(
    new ApiResponse(201, feedback, "Feedback submitted successfully! Thank you for your review.")
  );
});

export const getFeedbackForUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const feedbacks = await Feedback.find({ to: userId })
    .populate("from", "name")
    .sort("-createdAt");
  
  if (feedbacks.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, feedbacks, "No feedback found for this user yet.")
    );
  }

  res.status(200).json(
    new ApiResponse(200, feedbacks, `Found ${feedbacks.length} feedback(s) for this user`)
  );
});
