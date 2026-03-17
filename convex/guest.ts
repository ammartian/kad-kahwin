import { v } from "convex/values";
import { query } from "./_generated/server";
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

    return {
      ...event,
      backgroundImageUrl,
      donationQrUrl,
    };
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
