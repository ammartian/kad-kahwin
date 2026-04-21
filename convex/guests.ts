import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

async function requireManager(
  ctx: QueryCtx | MutationCtx,
  eventId: Id<"events">,
  userId: string
) {
  const manager = await ctx.db
    .query("managers")
    .withIndex("by_event_user", (q) =>
      q.eq("eventId", eventId).eq("userId", userId)
    )
    .first();

  if (!manager) throw new Error("Unauthorized: not a manager of this event");
  return manager;
}

function enrichGuestsWithRsvp<T extends { name: string }>(
  guests: T[],
  rsvps: { guestName: string; attending: boolean; paxCount: number; submittedAt: number }[]
) {
  const rsvpByGuestName = new Map(rsvps.map((r) => [r.guestName.toLowerCase(), r]));
  return guests.map((g) => {
    const rsvp = rsvpByGuestName.get(g.name.toLowerCase());
    return {
      ...g,
      rsvpStatus: rsvp
        ? { attending: rsvp.attending, paxCount: rsvp.paxCount, submittedAt: rsvp.submittedAt }
        : null,
    };
  });
}

export const listGuests = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return [];

    await requireManager(ctx, args.eventId, user._id as string);

    const guests = await ctx.db
      .query("guests")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const rsvps = await ctx.db
      .query("rsvps")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    return enrichGuestsWithRsvp(guests, rsvps);
  },
});

export const listGuestsPaginated = query({
  args: {
    eventId: v.id("events"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    await requireManager(ctx, args.eventId, user._id as string);

    const result = await ctx.db
      .query("guests")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .paginate(args.paginationOpts);

    // Per-guest RSVP lookup (avoids loading all RSVPs for large events)
    const rsvps = await Promise.all(
      result.page.map((g) =>
        ctx.db
          .query("rsvps")
          .withIndex("by_event_guestNameLower", (q) =>
            q
              .eq("eventId", args.eventId)
              .eq("guestNameLower", g.name.toLowerCase())
          )
          .first()
      )
    );

    return {
      ...result,
      page: result.page.map((g, i) => {
        const rsvp = rsvps[i];
        return {
          ...g,
          rsvpStatus: rsvp
            ? {
                attending: rsvp.attending,
                paxCount: rsvp.paxCount,
                submittedAt: rsvp.submittedAt,
              }
            : null,
        };
      }),
    };
  },
});

export const addGuest = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    maxPax: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    await requireManager(ctx, args.eventId, user._id as string);

    const name = args.name.trim();
    if (!name || name.length > 100) throw new Error("Name must be 1–100 characters");

    const maxPax = args.maxPax ?? 10;
    if (maxPax < 1 || maxPax > 10) throw new Error("Max pax must be 1–10");

    return await ctx.db.insert("guests", {
      eventId: args.eventId,
      name,
      phone: args.phone?.trim(),
      email: args.email?.trim(),
      maxPax,
      createdAt: Date.now(),
    });
  },
});

export const deleteGuest = mutation({
  args: { guestId: v.id("guests") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const guest = await ctx.db.get(args.guestId);
    if (!guest) throw new Error("Guest not found");

    await requireManager(ctx, guest.eventId, user._id as string);

    await ctx.db.delete(args.guestId);
  },
});

const guestImportRow = v.object({
  name: v.string(),
  phone: v.optional(v.string()),
  email: v.optional(v.string()),
  maxPax: v.optional(v.number()),
});

export const importGuests = mutation({
  args: {
    eventId: v.id("events"),
    guests: v.array(guestImportRow),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    await requireManager(ctx, args.eventId, user._id as string);

    const errors: string[] = [];
    let imported = 0;
    const now = Date.now();

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (let i = 0; i < args.guests.length; i++) {
      const row = args.guests[i];
      const name = row.name?.trim?.();
      if (!name || name.length > 100) {
        errors.push(`Row ${i + 1}: Name is required and must be under 100 characters`);
        continue;
      }
      if (row.email && !EMAIL_REGEX.test(row.email.trim())) {
        errors.push(`Row ${i + 1}: Invalid email format`);
        continue;
      }
      const maxPax = row.maxPax ?? 10;
      if (maxPax < 1 || maxPax > 10) {
        errors.push(`Row ${i + 1}: Max pax must be 1–10`);
        continue;
      }
      try {
        await ctx.db.insert("guests", {
          eventId: args.eventId,
          name,
          phone: row.phone?.trim(),
          email: row.email?.trim(),
          maxPax,
          createdAt: now,
        });
        imported++;
      } catch {
        errors.push(`Row ${i + 1}: Failed to insert`);
      }
    }

    return { imported, errors };
  },
});

export const getRSVPAnalytics = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return null;

    await requireManager(ctx, args.eventId, user._id as string);

    const [guests, rsvps] = await Promise.all([
      ctx.db
        .query("guests")
        .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
        .collect(),
      ctx.db
        .query("rsvps")
        .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
        .collect(),
    ]);

    const rsvpNames = new Set(rsvps.map((r) => r.guestName.toLowerCase()));
    const totalAttending = rsvps.filter((r) => r.attending).length;
    const totalPax = rsvps
      .filter((r) => r.attending)
      .reduce((s, r) => s + r.paxCount, 0);
    const totalNotAttending = rsvps.filter((r) => !r.attending).length;
    const totalPending = guests.filter(
      (g) => !rsvpNames.has(g.name.toLowerCase())
    ).length;

    return {
      totalAttending,
      totalPax,
      totalNotAttending,
      totalPending,
    };
  },
});
