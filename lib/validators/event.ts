import { z } from "zod";

const SLUG_PATTERN = /^[a-z0-9-]+$/;

export const createEventSchema = z
  .object({
    coupleName: z.string().min(1, "Couple name is required").trim(),
    weddingDate: z.string().min(1, "Wedding date is required"),
    weddingTime: z.string().optional(),
    slug: z
      .string()
      .min(3, "URL must be at least 3 characters")
      .max(50, "URL must be at most 50 characters")
      .regex(SLUG_PATTERN, "Use only lowercase letters, numbers, and hyphens"),
    rsvpDeadline: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const weddingDateTime = data.weddingTime
      ? new Date(`${data.weddingDate}T${data.weddingTime}`)
      : new Date(data.weddingDate);
    const now = new Date();
    if (weddingDateTime <= now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["weddingDate"],
        message: "Wedding date and time must be in the future",
      });
    }
    if (data.rsvpDeadline) {
      const rsvpDate = new Date(data.rsvpDeadline);
      if (rsvpDate <= now) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rsvpDeadline"],
          message: "RSVP deadline must be in the future",
        });
      } else if (rsvpDate >= weddingDateTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rsvpDeadline"],
          message: "RSVP deadline must be before the wedding date",
        });
      }
    }
  });

export type CreateEventFormData = z.infer<typeof createEventSchema>;
