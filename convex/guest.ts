import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

export const getEventBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const slug = args.slug.toLowerCase().trim();
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!event || !event.published) return null;

    const [backgroundImageUrl, donationQrUrl] = await Promise.all([
      event.backgroundImageId
        ? ctx.storage.getUrl(event.backgroundImageId)
        : null,
      event.donationQrId ? ctx.storage.getUrl(event.donationQrId) : null,
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
      carouselImageUrls,
    };
  },
});

export const getCarouselImages = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event || !event.carouselImageIds || event.carouselImageIds.length === 0) {
      return [];
    }
    const urls = await Promise.all(
      event.carouselImageIds.map((id) => ctx.storage.getUrl(id))
    );
    return urls.filter((url): url is string => url !== null);
  },
});

export const updateCarouselImages = mutation({
  args: {
    eventId: v.id("events"),
    imageIds: v.array(v.id("_storage")),
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
    if (args.imageIds.length > 10) throw new Error("Maximum 10 carousel images allowed");

    await ctx.db.patch(args.eventId, { carouselImageIds: args.imageIds });
  },
});

export const isManagerOfEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return false;
    const manager = await ctx.db
      .query("managers")
      .withIndex("by_event_user", (q) =>
        q.eq("eventId", args.eventId).eq("userId", user._id as string)
      )
      .first();
    return !!manager;
  },
});
