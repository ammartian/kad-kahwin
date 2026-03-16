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

    const weddingDateTime = args.weddingTime
      ? new Date(`${args.weddingDate}T${args.weddingTime}`)
      : new Date(args.weddingDate);
    const nowDate = new Date();
    if (weddingDateTime <= nowDate) throw new Error("Wedding date and time must be in the future");

    if (args.rsvpDeadline) {
      const rsvpDate = new Date(args.rsvpDeadline);
      if (rsvpDate <= nowDate) throw new Error("RSVP deadline must be in the future");
      if (rsvpDate >= weddingDateTime) throw new Error("RSVP deadline must be before the wedding date");
    }

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

    // Capped at 50; each db.get is O(1) by _id — acceptable for MVP
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

export const getEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return null;

    const manager = await ctx.db
      .query("managers")
      .withIndex("by_event_user", (q) =>
        q.eq("eventId", args.eventId).eq("userId", user._id as string)
      )
      .first();

    if (!manager) return null;

    const event = await ctx.db.get(args.eventId);
    if (!event) return null;

    const backgroundImageUrl = event.backgroundImageId
      ? await ctx.storage.getUrl(event.backgroundImageId)
      : null;

    return {
      ...event,
      backgroundImageUrl,
    };
  },
});

export const updateEvent = mutation({
  args: {
    eventId: v.id("events"),
    coupleName: v.optional(v.string()),
    weddingDate: v.optional(v.string()),
    weddingTime: v.optional(v.string()),
    locationWaze: v.optional(v.string()),
    locationGoogle: v.optional(v.string()),
    locationApple: v.optional(v.string()),
    backgroundImageId: v.optional(v.id("_storage")),
    clearBackgroundImage: v.optional(v.boolean()),
    backgroundColor: v.optional(v.string()),
    colorPrimary: v.optional(v.string()),
    colorSecondary: v.optional(v.string()),
    colorAccent: v.optional(v.string()),
    musicYoutubeUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const manager = await ctx.db
      .query("managers")
      .withIndex("by_event_user", (q) =>
        q.eq("eventId", args.eventId).eq("userId", user._id as string)
      )
      .first();

    if (!manager) throw new Error("Unauthorized: not a manager of this event");

    const { eventId, clearBackgroundImage, ...updates } = args;
    const patch: Record<string, unknown> = {};
    if (updates.coupleName !== undefined) patch.coupleName = updates.coupleName;
    if (updates.weddingDate !== undefined) patch.weddingDate = updates.weddingDate;
    if (updates.weddingTime !== undefined) patch.weddingTime = updates.weddingTime;
    if (updates.locationWaze !== undefined) patch.locationWaze = updates.locationWaze;
    if (updates.locationGoogle !== undefined) patch.locationGoogle = updates.locationGoogle;
    if (updates.locationApple !== undefined) patch.locationApple = updates.locationApple;
    if (updates.backgroundColor !== undefined) patch.backgroundColor = updates.backgroundColor;
    if (updates.colorPrimary !== undefined) patch.colorPrimary = updates.colorPrimary;
    if (updates.colorSecondary !== undefined) patch.colorSecondary = updates.colorSecondary;
    if (updates.colorAccent !== undefined) patch.colorAccent = updates.colorAccent;
    if (updates.musicYoutubeUrl !== undefined) patch.musicYoutubeUrl = updates.musicYoutubeUrl;
    if (updates.backgroundImageId !== undefined) patch.backgroundImageId = updates.backgroundImageId;
    if (clearBackgroundImage) patch.backgroundImageId = undefined;
    if (Object.keys(patch).length === 0) return;

    await ctx.db.patch(eventId, patch as Record<string, unknown>);

    if (updates.backgroundImageId) {
      const url = await ctx.storage.getUrl(updates.backgroundImageId);
      return { backgroundImageUrl: url };
    }
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
      .withIndex("by_event_user", (q) =>
        q.eq("eventId", args.eventId).eq("userId", user._id as string)
      )
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
