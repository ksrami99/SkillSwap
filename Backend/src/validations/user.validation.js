import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
  profilePhoto: z.string().optional(),
  skillsOffered: z.array(z.string()).optional(),
  skillsWanted: z.array(z.string()).optional(),
  availability: z.enum(["weekdays", "weekends", "evenings", "mornings", "anytime"]).optional(),
  bio: z.string().optional(),
  profileVisibility: z.enum(["public", "private"]).optional(),
});
