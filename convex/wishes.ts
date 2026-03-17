import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";

const MAX_MESSAGE_LENGTH = 255;

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

export const listWishes = query({
  args: {
    eventId: v.id("events"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event || !event.published) {
      return { page: [], isDone: true, continueCursor: "" };
    }
    return await ctx.db
      .query("wishes")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const addWish = mutation({
  args: {
    eventId: v.id("events"),
    guestName: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const name = args.guestName.trim();
    if (!name || name.length > 100) {
      throw new Error("Please enter your name (max 100 characters)");
    }

    const message = args.message.trim();
    if (!message) throw new Error("Wish cannot be empty");
    if (message.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Wish cannot exceed ${MAX_MESSAGE_LENGTH} characters`);
    }

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");
    if (!event.published) throw new Error("Event not found");

    await ctx.db.insert("wishes", {
      eventId: args.eventId,
      guestName: name,
      message,
      createdAt: Date.now(),
    });
  },
});

export const deleteWish = mutation({
  args: { wishId: v.id("wishes") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const wish = await ctx.db.get(args.wishId);
    if (!wish) throw new Error("Wish not found");

    await requireManager(ctx, wish.eventId, user._id as string);

    await ctx.db.delete(args.wishId);
  },
});
