import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  location: z.string().optional(),
  profilePhoto: z.string().url().optional(),
  skillsOffered: z.array(z.string()).optional(),
  skillsWanted: z.array(z.string()).optional(),
  availability: z.enum(["weekdays", "weekends", "evenings", "mornings", "anytime"]).optional(),
});
