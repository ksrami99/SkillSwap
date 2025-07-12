import SwapRequest from "../models/swapRequest.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createSwapRequest = asyncHandler(async (req, res) => {
  const { targetUserId } = req.params;
  const { message, offeredSkill, requestedSkill } = req.body;

  if (req.user.id === targetUserId) {
    throw ApiError.badRequest("You cannot send a swap request to yourself.");
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    throw ApiError.notFound("The user you're trying to contact doesn't exist or has deleted their account.");
  }
  
  if (targetUser.profileVisibility === "private") {
    throw ApiError.forbidden("This user's profile is private and cannot receive swap requests.");
  }

  const existing = await SwapRequest.findOne({
    requester: req.user.id,
    recipient: targetUserId,
    status: "pending",
  });

  if (existing) {
    throw ApiError.conflict("You already have a pending swap request with this user. Please wait for their response.");
  }

  const newRequest = await SwapRequest.create({
    requester: req.user.id,
    recipient: targetUserId,
    offeredSkill,
    requestedSkill,
    message,
  });

  res.status(201).json(
    new ApiResponse(201, newRequest, "Swap request sent successfully! The user will be notified.")
  );
});

export const getMySwaps = asyncHandler(async (req, res) => {
  const sent = await SwapRequest.find({ requester: req.user.id })
    .populate("recipient", "name skillsOffered")
    .sort("-createdAt");

  const received = await SwapRequest.find({ recipient: req.user.id })
    .populate("requester", "name skillsOffered")
    .sort("-createdAt");

  const totalRequests = sent.length + received.length;
  
  if (totalRequests === 0) {
    return res.status(200).json(
      new ApiResponse(200, { sent, received }, "You don't have any swap requests yet.")
    );
  }

  res.status(200).json(
    new ApiResponse(200, { sent, received }, `Found ${totalRequests} swap request(s)`)
  );
});

export const updateSwapRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  const request = await SwapRequest.findById(requestId);
  if (!request) {
    throw ApiError.notFound("Swap request not found. It may have been deleted or doesn't exist.");
  }
  
  if (request.recipient.toString() !== req.user.id) {
    throw ApiError.forbidden("You can only respond to swap requests sent to you.");
  }

  if (request.status !== "pending") {
    throw ApiError.badRequest("This request has already been processed and cannot be modified.");
  }

  request.status = status;
  await request.save();

  const statusText = status === "accepted" ? "accepted" : "declined";
  res.status(200).json(
    new ApiResponse(200, request, `Swap request ${statusText} successfully`)
  );
});

export const deleteSwapRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await SwapRequest.findById(requestId);
  if (!request) {
    throw ApiError.notFound("Swap request not found. It may have already been deleted.");
  }
  
  if (request.requester.toString() !== req.user.id) {
    throw ApiError.forbidden("You can only delete swap requests that you sent.");
  }

  if (request.status !== "pending") {
    throw ApiError.badRequest("Only pending requests can be deleted. This request has already been processed.");
  }

  await request.deleteOne();
  res.status(200).json(
    new ApiResponse(200, null, "Swap request deleted successfully")
  );
});
