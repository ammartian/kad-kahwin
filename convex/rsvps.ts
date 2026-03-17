import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

const PAX_MIN = 1;
const PAX_MAX = 10;

export const getRSVP = query({
  args: {
    eventId: v.id("events"),
    guestName: v.string(),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event || !event.published) return null;

    const name = args.guestName.trim();
    if (!name) return null;

    const nameLower = name.toLowerCase();

    // Optimized: use index for records with guestNameLower (new inserts)
    const byIndex = await ctx.db
      .query("rsvps")
      .withIndex("by_event_guestNameLower", (q) =>
        q.eq("eventId", args.eventId).eq("guestNameLower", nameLower)
      )
      .first();
    if (byIndex) return byIndex;

    // Fallback: scan for records without guestNameLower (legacy)
    const rsvps = await ctx.db
      .query("rsvps")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    return (
      rsvps.find((r) => r.guestName.toLowerCase() === nameLower) ?? null
    );
  },
});

export const submitRSVP = mutation({
  args: {
    eventId: v.id("events"),
    guestName: v.string(),
    attending: v.boolean(),
    paxCount: v.number(),
  },
  handler: async (ctx, args) => {
    const name = args.guestName.trim();
    if (!name || name.length > 100) {
      throw new Error("Please enter your name (max 100 characters)");
    }

    if (args.attending && (args.paxCount < PAX_MIN || args.paxCount > PAX_MAX)) {
      throw new Error("Number of guests must be between 1 and 10");
    }

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");
    if (!event.published) throw new Error("Event not found");

    if (event.rsvpDeadline) {
      const deadline = new Date(event.rsvpDeadline);
      if (Date.now() > deadline.getTime()) {
        throw new Error("RSVP deadline has passed");
      }
    }

    const nameLower = name.toLowerCase();

    // Optimized: use index for duplicate check
    const existingByIndex = await ctx.db
      .query("rsvps")
      .withIndex("by_event_guestNameLower", (q) =>
        q.eq("eventId", args.eventId).eq("guestNameLower", nameLower)
      )
      .first();
    if (existingByIndex) {
      throw new Error("You have already submitted your RSVP");
    }

    // Fallback: scan for legacy records without guestNameLower (pre-schema migration).
    // Trade-off: for events with 1000+ RSVPs this is O(n); consider backfilling guestNameLower.
    const rsvps = await ctx.db
      .query("rsvps")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    if (rsvps.some((r) => r.guestName.toLowerCase() === nameLower)) {
      throw new Error("You have already submitted your RSVP");
    }

    const paxCount = args.attending ? args.paxCount : 0;

    await ctx.db.insert("rsvps", {
      eventId: args.eventId,
      guestName: name,
      guestNameLower: nameLower,
      attending: args.attending,
      paxCount,
      submittedAt: Date.now(),
    });
  },
});
