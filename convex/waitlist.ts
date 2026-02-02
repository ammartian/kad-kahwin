import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get total count of waitlist subscribers
 * Used for social proof on landing page
 */
export const getWaitlistCount = query({
  args: {},
  handler: async (ctx) => {
    const waitlist = await ctx.db.query("waitlist").collect();
    return waitlist.length;
  },
});

/**
 * Get all waitlist entries
 * Future: Add authentication check for admin panel
 */
export const getWaitlist = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    const allEntries = await ctx.db
      .query("waitlist")
      .order("desc")
      .collect();

    // Simple pagination without cursor for MVP
    return {
      entries: allEntries.slice(0, limit),
      total: allEntries.length,
    };
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
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
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
    const email = args.email.toLowerCase().trim();

    // Validate email format with basic regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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
      source: args.source || "landing-page",
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
