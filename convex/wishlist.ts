import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { authComponent } from "./auth";
import { convertToAffiliateLink } from "./lib/affiliateConverter";

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

export const listWishlistItems = query({
  args: {
    eventId: v.id("events"),
    includeHidden: v.optional(v.boolean()),
    guestName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    const user = await authComponent.getAuthUser(ctx);
    let isManager = false;
    if (user) {
      const manager = await ctx.db
        .query("managers")
        .withIndex("by_event_user", (q) =>
          q.eq("eventId", args.eventId).eq("userId", user._id as string)
        )
        .first();
      isManager = !!manager;
    }

    if (!isManager && (!event || !event.published)) {
      return [];
    }

    const items = await ctx.db
      .query("wishlist_items")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const showHidden = args.includeHidden === true && isManager;

    const filtered = items
      .filter((item) => showHidden || item.isVisible)
      .sort((a, b) => a.createdAt - b.createdAt);

    // PRD §2.2.5: Guests see "Claimed" but not who claimed; managers see "Claimed by [name]"
    // PRD US-25: Guests can unclaim their own items — return claimedByMe when guestName matches
    const guestNameLower = args.guestName?.trim().toLowerCase();
    if (!isManager) {
      return filtered.map((item) => {
        const { claimedByName, ...rest } = item;
        const claimedByMe =
          claimedByName &&
          guestNameLower &&
          claimedByName.toLowerCase() === guestNameLower;
        return {
          ...rest,
          claimedByName: claimedByName ? "claimed" : undefined,
          claimedByMe: !!claimedByMe,
        };
      });
    }
    return filtered;
  },
});

export const addWishlistItem = mutation({
  args: {
    eventId: v.id("events"),
    title: v.string(),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    originalUrl: v.string(),
    addedBy: v.union(v.literal("manager"), v.literal("guest")),
    guestName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const title = args.title.trim();
    if (!title || title.length > 200) {
      throw new Error("Item title is required (max 200 characters)");
    }

    const url = args.originalUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      throw new Error("Please enter a valid product link");
    }

    if (args.addedBy === "manager") {
      const user = await authComponent.getAuthUser(ctx);
      if (!user) throw new Error("Unauthorized");
      await requireManager(ctx, args.eventId, user._id as string);
    } else {
      const event = await ctx.db.get(args.eventId);
      if (!event || !event.published) throw new Error("Event not found");
    }

    const { affiliateUrl, platform } = convertToAffiliateLink(url);
    const now = Date.now();

    const itemId = await ctx.db.insert("wishlist_items", {
      eventId: args.eventId,
      title,
      description: args.description?.trim(),
      price: args.price,
      originalUrl: url,
      affiliateUrl,
      platform,
      isVisible: true,
      addedBy: args.addedBy,
      createdAt: now,
      ...(args.addedBy === "guest" &&
        args.guestName && {
          claimedByName: args.guestName.trim(),
          claimedAt: now,
        }),
    });

    return itemId;
  },
});

export const updateWishlistItem = mutation({
  args: {
    itemId: v.id("wishlist_items"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    originalUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");

    await requireManager(ctx, item.eventId, user._id as string);

    const patch: Record<string, unknown> = {};
    if (args.title !== undefined) {
      const t = args.title.trim();
      if (!t || t.length > 200) throw new Error("Title must be 1–200 characters");
      patch.title = t;
    }
    if (args.description !== undefined) patch.description = args.description?.trim();
    if (args.price !== undefined) patch.price = args.price;
    if (args.originalUrl !== undefined) {
      const url = args.originalUrl.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        throw new Error("Please enter a valid product link");
      }
      const { affiliateUrl, platform } = convertToAffiliateLink(url);
      patch.originalUrl = url;
      patch.affiliateUrl = affiliateUrl;
      patch.platform = platform;
    }

    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(args.itemId, patch as Record<string, unknown>);
    }
  },
});

export const deleteWishlistItem = mutation({
  args: { itemId: v.id("wishlist_items") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");

    await requireManager(ctx, item.eventId, user._id as string);

    await ctx.db.delete(args.itemId);
  },
});

export const claimWishlistItem = mutation({
  args: {
    itemId: v.id("wishlist_items"),
    guestName: v.string(),
  },
  handler: async (ctx, args) => {
    const name = args.guestName.trim();
    if (!name || name.length > 100) {
      throw new Error("Please enter your name (max 100 characters)");
    }

    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");
    if (!item.isVisible) throw new Error("This item is no longer available");

    const event = await ctx.db.get(item.eventId);
    if (!event || !event.published) throw new Error("This item is no longer available");

    if (item.claimedByName) {
      throw new Error("This item has already been claimed");
    }

    await ctx.db.patch(args.itemId, {
      claimedByName: name,
      claimedAt: Date.now(),
    });
  },
});

export const unclaimWishlistItem = mutation({
  args: {
    itemId: v.id("wishlist_items"),
    guestName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");

    const user = await authComponent.getAuthUser(ctx);
    const isManager = user
      ? !!(await ctx.db
          .query("managers")
          .withIndex("by_event_user", (q) =>
            q.eq("eventId", item.eventId).eq("userId", user._id as string)
          )
          .first())
      : false;

    if (!isManager) {
      const event = await ctx.db.get(item.eventId);
      if (!event || !event.published) throw new Error("Event not found");
      if (!item.claimedByName) throw new Error("Item is not claimed");
      if (!args.guestName?.trim()) {
        throw new Error("Please enter your name to unclaim");
      }
      if (
        item.claimedByName.toLowerCase() !== args.guestName.trim().toLowerCase()
      ) {
        throw new Error("Only the person who claimed can unclaim");
      }
    }

    await ctx.db.patch(args.itemId, {
      claimedByName: undefined,
      claimedAt: undefined,
    });
  },
});

export const toggleWishlistItemVisibility = mutation({
  args: {
    itemId: v.id("wishlist_items"),
    isVisible: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");

    await requireManager(ctx, item.eventId, user._id as string);

    await ctx.db.patch(args.itemId, { isVisible: args.isVisible });
  },
});
