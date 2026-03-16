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
});
