import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
