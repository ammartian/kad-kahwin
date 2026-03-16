import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const SLUG_MIN_LENGTH = 3;
const SLUG_MAX_LENGTH = 50;

export const checkSlugAvailable = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const slug = args.slug.toLowerCase().trim();
    if (!slug) return { available: false, reason: "empty" as const };
    if (slug.length < SLUG_MIN_LENGTH || slug.length > SLUG_MAX_LENGTH) {
      return { available: false, reason: "invalid" as const };
    }
    if (!SLUG_PATTERN.test(slug)) return { available: false, reason: "invalid" as const };

    const existing = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    return {
      available: existing === null,
      reason: existing ? ("taken" as const) : ("available" as const),
    };
  },
});

export const createEvent = mutation({
  args: {
    coupleName: v.string(),
    weddingDate: v.string(),
    weddingTime: v.optional(v.string()),
    slug: v.string(),
    rsvpDeadline: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const slug = args.slug.toLowerCase().trim();
    if (!slug) throw new Error("Slug is required");
    if (slug.length < SLUG_MIN_LENGTH || slug.length > SLUG_MAX_LENGTH) {
      throw new Error("Slug must be 3–50 characters");
    }
    if (!SLUG_PATTERN.test(slug)) throw new Error("Slug must be alphanumeric and hyphens only");

    const weddingDate = new Date(args.weddingDate);
    if (weddingDate <= new Date()) throw new Error("Wedding date must be in the future");

    const existing = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (existing) throw new Error("This URL is already taken");

    const now = Date.now();
    const eventId = await ctx.db.insert("events", {
      slug,
      coupleName: args.coupleName.trim(),
      weddingDate: args.weddingDate,
      weddingTime: args.weddingTime,
      ...(args.rsvpDeadline && { rsvpDeadline: args.rsvpDeadline }),
      language: "ms",
      paid: false,
      published: false,
      createdAt: now,
    });

    await ctx.db.insert("managers", {
      eventId,
      userId: user._id as string,
      role: "owner",
      createdAt: now,
    });

    return eventId;
  },
});

export const listMyEvents = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return [];

    const managers = await ctx.db
      .query("managers")
      .withIndex("by_user", (q) => q.eq("userId", user._id as string))
      .collect();

    const eventIds = managers
      .filter((m) => m.userId !== undefined)
      .map((m) => m.eventId)
      .slice(0, 50);

    const events = await Promise.all(
      eventIds.map((id) => ctx.db.get(id))
    );

    const safe = events
      .filter((e): e is NonNullable<typeof e> => e !== null)
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((e) => ({
        _id: e._id,
        slug: e.slug,
        coupleName: e.coupleName,
        weddingDate: e.weddingDate,
        weddingTime: e.weddingTime,
        published: e.published,
        createdAt: e.createdAt,
      }));

    return safe;
  },
});

export const inviteCoManager = mutation({
  args: {
    eventId: v.id("events"),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const manager = await ctx.db
      .query("managers")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.eq(q.field("userId"), user._id as string))
      .first();

    if (!manager) throw new Error("Unauthorized: not a manager of this event");

    const managers = await ctx.db
      .query("managers")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    if (managers.length >= 2) throw new Error("Maximum 2 managers per event");

    const email = args.email.toLowerCase().trim();
    const callerEmail = (user as { email?: string }).email?.toLowerCase().trim();
    if (callerEmail && callerEmail === email) throw new Error("Cannot invite yourself");

    for (const m of managers) {
      if (m.invitedEmail?.toLowerCase() === email) {
        throw new Error("This email is already invited");
      }
    }

    await ctx.db.insert("managers", {
      eventId: args.eventId,
      role: "co-manager",
      invitedEmail: email,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});
