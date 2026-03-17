import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    googleId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  waitlist: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
    source: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("invited"),
      v.literal("converted")
    ),
  })
    .index("by_email", ["email"])
    .index("by_subscribed_at", ["subscribedAt"]),

  events: defineTable({
    slug: v.string(),
    coupleName: v.string(),
    weddingDate: v.string(),
    weddingTime: v.optional(v.string()),
    locationWaze: v.optional(v.string()),
    locationGoogle: v.optional(v.string()),
    locationApple: v.optional(v.string()),
    backgroundImageId: v.optional(v.id("_storage")),
    backgroundColor: v.optional(v.string()),
    colorPrimary: v.optional(v.string()),
    colorSecondary: v.optional(v.string()),
    colorAccent: v.optional(v.string()),
    musicYoutubeUrl: v.optional(v.string()),
    language: v.union(v.literal("ms"), v.literal("en")),
    rsvpDeadline: v.optional(v.string()),
    donationQrId: v.optional(v.id("_storage")),
    bankName: v.optional(v.string()),
    bankAccount: v.optional(v.string()),
    bankHolder: v.optional(v.string()),
    paid: v.boolean(),
    published: v.boolean(),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  managers: defineTable({
    eventId: v.id("events"),
    userId: v.optional(v.string()),
    role: v.union(v.literal("owner"), v.literal("co-manager")),
    invitedEmail: v.optional(v.string()),
    acceptedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_event_user", ["eventId", "userId"])
    .index("by_user", ["userId"]),

  guests: defineTable({
    eventId: v.id("events"),
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    maxPax: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_event", ["eventId"]),

  rsvps: defineTable({
    eventId: v.id("events"),
    guestName: v.string(),
    guestNameLower: v.optional(v.string()),
    attending: v.boolean(),
    paxCount: v.number(),
    submittedAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_event_and_name", ["eventId", "guestName"])
    .index("by_event_guestNameLower", ["eventId", "guestNameLower"]),

  wishlist_items: defineTable({
    eventId: v.id("events"),
    title: v.string(),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    originalUrl: v.string(),
    affiliateUrl: v.string(),
    platform: v.union(
      v.literal("shopee"),
      v.literal("lazada"),
      v.literal("other")
    ),
    isVisible: v.boolean(),
    claimedByName: v.optional(v.string()),
    claimedAt: v.optional(v.number()),
    addedBy: v.union(v.literal("manager"), v.literal("guest")),
    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_event_visible", ["eventId", "isVisible"]),

  wishes: defineTable({
    eventId: v.id("events"),
    guestName: v.string(),
    message: v.string(),
    createdAt: v.number(),
  }).index("by_event", ["eventId"]),
});
