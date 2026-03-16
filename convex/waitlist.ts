import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { isValidEmail, normaliseEmail } from "../lib/utils/validateEmail";

/**
 * Get total count of waitlist subscribers.
 * Convex has no native COUNT — we paginate up to 10,000 entries.
 * At MVP scale this is safe; revisit with a counter document if count exceeds 10k.
 */
export const getWaitlistCount = query({
  args: {},
  handler: async (ctx) => {
    const { page, isDone, continueCursor } = await ctx.db
      .query("waitlist")
      .withIndex("by_subscribed_at")
      .paginate({ numItems: 10000, cursor: null });

    // Warn in dev if count is at the ceiling — indicates counter doc is needed
    if (!isDone && continueCursor) {
      console.warn("getWaitlistCount: waitlist exceeds 10k — count is approximate");
    }

    return page.length;
  },
});

/**
 * Get all waitlist entries — admin only.
 * Requires authentication to prevent PII exposure.
 */
export const getWaitlist = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const limit = args.limit ?? 100;
    const entries = await ctx.db
      .query("waitlist")
      .withIndex("by_subscribed_at")
      .order("desc")
      .take(limit);

    return { entries, total: entries.length };
  },
});

/**
 * Check if email already exists in waitlist
 */
export const checkEmailExists = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", normaliseEmail(args.email)))
      .first();

    return existing !== null;
  },
});

/**
 * Add email to waitlist
 * Validates email format and prevents duplicates
 */
export const addToWaitlist = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = normaliseEmail(args.email);

    if (!isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    // Check for existing email
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      throw new Error("Email already subscribed to waitlist");
    }

    // Add to waitlist
    const id = await ctx.db.insert("waitlist", {
      email,
      subscribedAt: Date.now(),
      source: args.source ?? "landing-page",
      status: "pending",
    });

    return {
      success: true,
      id,
      email,
      message: "Successfully added to waitlist!",
    };
  },
});
