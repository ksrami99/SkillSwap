import Feedback from "../models/feedback.model.js";
import SwapRequest from "../models/swapRequest.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const giveFeedback = async (req, res, next) => {
  try {
    const { userId, swapId } = req.params;
    const { rating, comment } = req.body;

    if (req.user.id === userId) {
      throw new ApiError(400, "You cannot rate yourself");
    }

    const swap = await SwapRequest.findById(swapId);
    if (!swap || swap.status !== "accepted") {
      throw new ApiError(400, "Swap must be accepted to give feedback");
    }

    const alreadyGiven = await Feedback.findOne({
      from: req.user.id,
      to: userId,
      swapId,
    });
    if (alreadyGiven) {
      throw new ApiError(400, "Feedback already submitted for this swap");
    }

    const feedback = await Feedback.create({
      from: req.user.id,
      to: userId,
      swapId,
      rating,
      comment,
    });

    res.status(201).json(new ApiResponse(201, feedback, "Feedback submitted"));
  } catch (err) {
    next(err);
  }
};

export const getFeedbackForUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const feedbacks = await Feedback.find({ to: userId })
      .populate("from", "name")
      .sort("-createdAt");
    res.status(200).json(new ApiResponse(200, feedbacks, "Feedbacks for user"));
  } catch (err) {
    next(err);
  }
};
