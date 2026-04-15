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

    const [backgroundImageUrl, donationQrUrl, eventDetailsBgImageUrl, wishesBgImageUrl] = await Promise.all([
      event.backgroundImageId
        ? ctx.storage.getUrl(event.backgroundImageId)
        : null,
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
      _id: event._id,
      _creationTime: event._creationTime,
      slug: event.slug,
      coupleName: event.coupleName,
      weddingDate: event.weddingDate,
      weddingTime: event.weddingTime,
      venueName: event.venueName,
      venueAddress: event.venueAddress,
      locationWaze: event.locationWaze,
      locationGoogle: event.locationGoogle,
      locationApple: event.locationApple,
      backgroundColor: event.backgroundColor,
      colorPrimary: event.colorPrimary,
      colorSecondary: event.colorSecondary,
      colorAccent: event.colorAccent,
      musicYoutubeUrl: event.musicYoutubeUrl,
      rsvpDeadline: event.rsvpDeadline,
      language: event.language,
      published: event.published,
      backgroundImageUrl,
      donationQrUrl,
      bankName: event.bankName,
      bankAccount: event.bankAccount,
      bankHolder: event.bankHolder,
      carouselImageUrls,
      eventDetailsBgImageUrl,
      eventDetailsBgColor: event.eventDetailsBgColor,
      eventDetailsColorPrimary: event.eventDetailsColorPrimary,
      eventDetailsColorSecondary: event.eventDetailsColorSecondary,
      eventDetailsColorAccent: event.eventDetailsColorAccent,
      wishesBgImageUrl,
      wishesBgColor: event.wishesBgColor,
      wishesColorPrimary: event.wishesColorPrimary,
      wishesColorSecondary: event.wishesColorSecondary,
      wishesColorAccent: event.wishesColorAccent,
    };
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
