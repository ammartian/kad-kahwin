import { z } from "zod";

const SLUG_PATTERN = /^[a-z0-9-]+$/;

export const createEventSchema = z.object({
  coupleName: z.string().min(1, "Couple name is required").trim(),
  weddingDate: z
    .string()
    .min(1, "Wedding date is required")
    .refine((val) => new Date(val) > new Date(), "Wedding date must be in the future"),
  weddingTime: z.string().optional(),
  slug: z
    .string()
    .min(3, "URL must be at least 3 characters")
    .max(50, "URL must be at most 50 characters")
    .regex(SLUG_PATTERN, "Use only lowercase letters, numbers, and hyphens"),
  rsvpDeadline: z.string().optional(),
  coManagerEmail: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Invalid email"),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;
