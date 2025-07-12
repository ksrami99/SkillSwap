import { z } from "zod";

export const swapRequestSchema = z.object({
  message: z.string().max(200).optional(),
  offeredSkill: z.string().min(1, "Offered skill is required"),
  requestedSkill: z.string().min(1, "Requested skill is required"),
});

export const updateSwapSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});
