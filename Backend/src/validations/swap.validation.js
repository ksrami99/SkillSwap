import { z } from "zod";

export const swapRequestSchema = z.object({
  message: z.string().max(200).optional(),
  offeredSkill: z.string(),
  requestedSkill: z.string(),
});

export const updateSwapSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});
