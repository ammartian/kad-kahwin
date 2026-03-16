import { v } from "convex/values";
import { query } from "./_generated/server";

export const getEventBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const slug = args.slug.toLowerCase().trim();
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!event || !event.published) return null;

    const backgroundImageUrl = event.backgroundImageId
      ? await ctx.storage.getUrl(event.backgroundImageId)
      : null;

    return {
      ...event,
      backgroundImageUrl,
    };
  },
});
