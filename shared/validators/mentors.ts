import { z } from "zod";

export const mentorStatValidator = z.object({
  label: z.string(),
  value: z.string(),
});

export const mentorValidator = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().min(1),
  quote: z.string().optional(),
  imageUrl: z.string().min(1),
  skills: z.array(z.string()),
  stats: z.array(mentorStatValidator).optional(),
});

export type MentorInput = z.infer<typeof mentorValidator>;
