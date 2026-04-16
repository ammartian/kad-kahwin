import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const SLUG_MIN_LENGTH = 3;
const SLUG_MAX_LENGTH = 50;
const YOUTUBE_PATTERN =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

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

    const [backgroundImageUrl, donationQrUrl, eventDetailsBgImageUrl, wishesBgImageUrl] = await Promise.all([
      event.backgroundImageId ? ctx.storage.getUrl(event.backgroundImageId) : null,
      event.donationQrId ? ctx.storage.getUrl(event.donationQrId) : null,
      event.eventDetailsBgImageId ? ctx.storage.getUrl(event.eventDetailsBgImageId) : null,
      event.wishesBgImageId ? ctx.storage.getUrl(event.wishesBgImageId) : null,
    ]);

    const carouselImageUrls: string[] = [];
    if (event.carouselImageIds && event.carouselImageIds.length > 0) {
      const urls = await Promise.all(
        event.carouselImageIds.map((id) => ctx.storage.getUrl(id))
      );
      for (const url of urls) {
        if (url) carouselImageUrls.push(url);
      }
    }

    return {
      ...event,
      backgroundImageUrl,
      donationQrUrl,
      eventDetailsBgImageUrl,
      wishesBgImageUrl,
      carouselImageUrls,
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
    donationQrId: v.optional(v.id("_storage")),
    clearDonationQr: v.optional(v.boolean()),
    bankName: v.optional(v.string()),
    bankAccount: v.optional(v.string()),
    bankHolder: v.optional(v.string()),
    rsvpDeadline: v.optional(v.string()),
    published: v.optional(v.boolean()),
    backgroundColor: v.optional(v.string()),
    colorPrimary: v.optional(v.string()),
    colorSecondary: v.optional(v.string()),
    colorAccent: v.optional(v.string()),
    musicYoutubeUrl: v.optional(v.string()),
    venueName: v.optional(v.string()),
    venueAddress: v.optional(v.string()),
    carouselImageIds: v.optional(v.array(v.id("_storage"))),
    // Event Details section overrides
    eventDetailsBgImageId: v.optional(v.id("_storage")),
    clearEventDetailsBgImage: v.optional(v.boolean()),
    eventDetailsBgColor: v.optional(v.string()),
    eventDetailsColorPrimary: v.optional(v.string()),
    eventDetailsColorSecondary: v.optional(v.string()),
    eventDetailsColorAccent: v.optional(v.string()),
    // Wishes section overrides
    wishesBgImageId: v.optional(v.id("_storage")),
    clearWishesBgImage: v.optional(v.boolean()),
    wishesBgColor: v.optional(v.string()),
    wishesColorPrimary: v.optional(v.string()),
    wishesColorSecondary: v.optional(v.string()),
    wishesColorAccent: v.optional(v.string()),
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

    const { eventId, clearBackgroundImage, clearDonationQr, clearEventDetailsBgImage, clearWishesBgImage, ...updates } = args;

    if (
      updates.musicYoutubeUrl !== undefined &&
      updates.musicYoutubeUrl !== "" &&
      !YOUTUBE_PATTERN.test(updates.musicYoutubeUrl.trim())
    ) {
      throw new Error("Please enter a valid YouTube link");
    }

    const SCALAR_FIELDS = [
      "coupleName", "weddingDate", "weddingTime",
      "locationWaze", "locationGoogle", "locationApple",
      "backgroundColor", "colorPrimary", "colorSecondary", "colorAccent",
      "musicYoutubeUrl", "backgroundImageId", "donationQrId",
      "bankName", "bankAccount", "bankHolder",
      "rsvpDeadline", "published", "venueName", "venueAddress", "carouselImageIds",
      "eventDetailsBgImageId", "eventDetailsBgColor",
      "eventDetailsColorPrimary", "eventDetailsColorSecondary", "eventDetailsColorAccent",
      "wishesBgImageId", "wishesBgColor",
      "wishesColorPrimary", "wishesColorSecondary", "wishesColorAccent",
    ] as const;

    const patch: Record<string, unknown> = {};
    for (const key of SCALAR_FIELDS) {
      if (updates[key] !== undefined) patch[key] = updates[key];
    }
    if (clearBackgroundImage) patch.backgroundImageId = undefined;
    if (clearDonationQr) patch.donationQrId = undefined;
    if (clearEventDetailsBgImage) patch.eventDetailsBgImageId = undefined;
    if (clearWishesBgImage) patch.wishesBgImageId = undefined;

    if (Object.keys(patch).length === 0) return;

    await ctx.db.patch(eventId, patch as Record<string, unknown>);
  },
});
