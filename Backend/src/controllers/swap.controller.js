import SwapRequest from "../models/swapRequest.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createSwapRequest = async (req, res, next) => {
  try {
    const { targetUserId } = req.params;
    const { message, offeredSkill, requestedSkill } = req.body;

    if (req.user.id === targetUserId) {
      throw new ApiError(400, "You can't request yourself");
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser || targetUser.profileVisibility === "private") {
      throw new ApiError(404, "Target user not found");
    }

    const existing = await SwapRequest.findOne({
      requester: req.user.id,
      recipient: targetUserId,
      status: "pending",
    });

    if (existing) throw new ApiError(400, "You already sent a request");

    const newRequest = await SwapRequest.create({
      requester: req.user.id,
      recipient: targetUserId,
      offeredSkill,
      requestedSkill,
      message,
    });

    res.status(201).json(new ApiResponse(201, newRequest, "Swap request sent"));
  } catch (err) {
    next(err);
  }
};

export const getMySwaps = async (req, res, next) => {
  try {
    const sent = await SwapRequest.find({ requester: req.user.id })
      .populate("recipient", "name skillsOffered")
      .sort("-createdAt");

    const received = await SwapRequest.find({ recipient: req.user.id })
      .populate("requester", "name skillsOffered")
      .sort("-createdAt");

    res
      .status(200)
      .json(new ApiResponse(200, { sent, received }, "Your swap requests"));
  } catch (err) {
    next(err);
  }
};

export const updateSwapRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await SwapRequest.findById(requestId);
    if (!request || request.recipient.toString() !== req.user.id) {
      throw new ApiError(403, "Not allowed to modify this request");
    }

    if (request.status !== "pending") {
      throw new ApiError(400, "Request already handled");
    }

    request.status = status;
    await request.save();

    res.status(200).json(new ApiResponse(200, request, `Request ${status}`));
  } catch (err) {
    next(err);
  }
};

export const deleteSwapRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    const request = await SwapRequest.findById(requestId);
    if (!request || request.requester.toString() !== req.user.id) {
      throw new ApiError(403, "Not allowed to delete this request");
    }

    if (request.status !== "pending") {
      throw new ApiError(400, "Only pending requests can be deleted");
    }

    await request.deleteOne();
    res.status(200).json(new ApiResponse(200, null, "Request deleted"));
  } catch (err) {
    next(err);
  }
};
