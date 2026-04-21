import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Tests for wishlist business logic (claim, unclaim, addWishlistItem).
 * Replicates handler logic against mocked db to catch regressions.
 */

type WishlistItem = {
  _id: string;
  eventId: string;
  isVisible: boolean;
  claimedByName?: string;
};

type Event = { _id: string; published: boolean };

async function claimWishlistItemLogic(
  db: {
    getItem: (itemId: string) => Promise<WishlistItem | null>;
    getEvent: (eventId: string) => Promise<Event | null>;
    patchItem: (itemId: string, patch: { claimedByName: string; claimedAt: number }) => Promise<void>;
  },
  args: { itemId: string; guestName: string }
): Promise<void> {
  const name = args.guestName.trim();
  if (!name || name.length > 100) {
    throw new Error("Please enter your name (max 100 characters)");
  }

  const item = await db.getItem(args.itemId);
  if (!item) throw new Error("Item not found");
  if (!item.isVisible) throw new Error("This item is no longer available");

  const event = await db.getEvent(item.eventId);
  if (!event || !event.published) throw new Error("This item is no longer available");

  if (item.claimedByName) {
    throw new Error("This item has already been claimed");
  }

  await db.patchItem(args.itemId, {
    claimedByName: name,
    claimedAt: Date.now(),
  });
}

async function unclaimWishlistItemLogic(
  db: {
    getItem: (itemId: string) => Promise<WishlistItem | null>;
    getEvent: (eventId: string) => Promise<Event | null>;
    isManager: (eventId: string) => Promise<boolean>;
    patchItem: (itemId: string, patch: { claimedByName?: undefined; claimedAt?: undefined }) => Promise<void>;
  },
  args: { itemId: string; guestName?: string }
): Promise<void> {
  const item = await db.getItem(args.itemId);
  if (!item) throw new Error("Item not found");

  const isManager = await db.isManager(item.eventId);

  if (!isManager) {
    const event = await db.getEvent(item.eventId);
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

  await db.patchItem(args.itemId, {
    claimedByName: undefined,
    claimedAt: undefined,
  });
}

function addWishlistItemValidation(args: {
  title: string;
  originalUrl: string;
}): void {
  const title = args.title.trim();
  if (!title || title.length > 200) {
    throw new Error("Item title is required (max 200 characters)");
  }

  const url = args.originalUrl.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error("Please enter a valid product link");
  }
}

describe("wishlist: claimWishlistItem business logic", () => {
  const itemId = "item-123";
  const eventId = "event-123";

  const visibleUnclaimedItem: WishlistItem = {
    _id: itemId,
    eventId,
    isVisible: true,
  };

  let db: {
    getItem: ReturnType<typeof vi.fn<(id: string) => Promise<WishlistItem | null>>>;
    getEvent: ReturnType<typeof vi.fn<(id: string) => Promise<Event | null>>>;
    patchItem: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    db = {
      getItem: vi.fn().mockResolvedValue(visibleUnclaimedItem),
      getEvent: vi.fn().mockResolvedValue({ _id: eventId, published: true }),
      patchItem: vi.fn().mockResolvedValue(undefined),
    };
  });

  it("rejects empty guest name", async () => {
    await expect(
      claimWishlistItemLogic(db, {
        itemId,
        guestName: "   ",
      })
    ).rejects.toThrow("Please enter your name");
    expect(db.patchItem).not.toHaveBeenCalled();
  });

  it("rejects guest name exceeding 100 chars", async () => {
    await expect(
      claimWishlistItemLogic(db, {
        itemId,
        guestName: "a".repeat(101),
      })
    ).rejects.toThrow("max 100 characters");
    expect(db.patchItem).not.toHaveBeenCalled();
  });

  it("rejects when item already claimed (double-claim prevention)", async () => {
    db.getItem.mockResolvedValue({
      ...visibleUnclaimedItem,
      claimedByName: "Ahmad",
    });
    await expect(
      claimWishlistItemLogic(db, {
        itemId,
        guestName: "Siti",
      })
    ).rejects.toThrow("This item has already been claimed");
    expect(db.patchItem).not.toHaveBeenCalled();
  });

  it("rejects when item not visible", async () => {
    db.getItem.mockResolvedValue({
      ...visibleUnclaimedItem,
      isVisible: false,
    });
    await expect(
      claimWishlistItemLogic(db, {
        itemId,
        guestName: "Ahmad",
      })
    ).rejects.toThrow("This item is no longer available");
    expect(db.patchItem).not.toHaveBeenCalled();
  });

  it("rejects when event not published", async () => {
    db.getEvent.mockResolvedValue({ _id: eventId, published: false });
    await expect(
      claimWishlistItemLogic(db, {
        itemId,
        guestName: "Ahmad",
      })
    ).rejects.toThrow("This item is no longer available");
    expect(db.patchItem).not.toHaveBeenCalled();
  });

  it("accepts valid claim and patches item", async () => {
    await claimWishlistItemLogic(db, {
      itemId,
      guestName: "Ahmad",
    });

    expect(db.patchItem).toHaveBeenCalledOnce();
    const patch = db.patchItem.mock.calls[0][1];
    expect(patch.claimedByName).toBe("Ahmad");
    expect(typeof patch.claimedAt).toBe("number");
  });

  it("trims guest name before storing", async () => {
    await claimWishlistItemLogic(db, {
      itemId,
      guestName: "  Ahmad  ",
    });

    const patch = db.patchItem.mock.calls[0][1];
    expect(patch.claimedByName).toBe("Ahmad");
  });
});

describe("wishlist: unclaimWishlistItem business logic (guest path)", () => {
  const itemId = "item-123";
  const eventId = "event-123";

  const claimedItem: WishlistItem = {
    _id: itemId,
    eventId,
    isVisible: true,
    claimedByName: "Ahmad",
  };

  let db: {
    getItem: ReturnType<typeof vi.fn<(id: string) => Promise<WishlistItem | null>>>;
    getEvent: ReturnType<typeof vi.fn<(id: string) => Promise<Event | null>>>;
    isManager: ReturnType<typeof vi.fn<(id: string) => Promise<boolean>>>;
    patchItem: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    db = {
      getItem: vi.fn().mockResolvedValue(claimedItem),
      getEvent: vi.fn().mockResolvedValue({ _id: eventId, published: true }),
      isManager: vi.fn().mockResolvedValue(false),
      patchItem: vi.fn().mockResolvedValue(undefined),
    };
  });

  it("rejects when guestName missing", async () => {
    await expect(
      unclaimWishlistItemLogic(db, {
        itemId,
        guestName: undefined,
      })
    ).rejects.toThrow("Please enter your name to unclaim");
    expect(db.patchItem).not.toHaveBeenCalled();
  });

  it("rejects when guestName is empty string", async () => {
    await expect(
      unclaimWishlistItemLogic(db, {
        itemId,
        guestName: "   ",
      })
    ).rejects.toThrow("Please enter your name to unclaim");
    expect(db.patchItem).not.toHaveBeenCalled();
  });

  it("rejects when name does not match claimedByName", async () => {
    await expect(
      unclaimWishlistItemLogic(db, {
        itemId,
        guestName: "Siti",
      })
    ).rejects.toThrow("Only the person who claimed can unclaim");
    expect(db.patchItem).not.toHaveBeenCalled();
  });

  it("accepts when name matches (case-insensitive)", async () => {
    await unclaimWishlistItemLogic(db, {
      itemId,
      guestName: "ahmad",
    });

    expect(db.patchItem).toHaveBeenCalledOnce();
    const patch = db.patchItem.mock.calls[0][1];
    expect(patch.claimedByName).toBeUndefined();
    expect(patch.claimedAt).toBeUndefined();
  });

  it("accepts when name matches with different casing", async () => {
    db.getItem.mockResolvedValue({
      ...claimedItem,
      claimedByName: "Ahmad bin Ali",
    });
    await unclaimWishlistItemLogic(db, {
      itemId,
      guestName: "AHMAD BIN ALI",
    });

    expect(db.patchItem).toHaveBeenCalledOnce();
  });
});

describe("wishlist: addWishlistItem validation", () => {
  it("rejects empty title", () => {
    expect(() =>
      addWishlistItemValidation({
        title: "   ",
        originalUrl: "https://shopee.com.my/product",
      })
    ).toThrow("Item title is required");
  });

  it("rejects title exceeding 200 chars", () => {
    expect(() =>
      addWishlistItemValidation({
        title: "a".repeat(201),
        originalUrl: "https://shopee.com.my/product",
      })
    ).toThrow("max 200 characters");
  });

  it("rejects invalid URL (no http/https)", () => {
    expect(() =>
      addWishlistItemValidation({
        title: "Gift",
        originalUrl: "ftp://example.com/product",
      })
    ).toThrow("Please enter a valid product link");
  });

  it("rejects invalid URL (plain text)", () => {
    expect(() =>
      addWishlistItemValidation({
        title: "Gift",
        originalUrl: "not-a-url",
      })
    ).toThrow("Please enter a valid product link");
  });

  it("accepts valid https URL", () => {
    expect(() =>
      addWishlistItemValidation({
        title: "Gift",
        originalUrl: "https://shopee.com.my/product-i.123.456",
      })
    ).not.toThrow();
  });

  it("accepts valid http URL", () => {
    expect(() =>
      addWishlistItemValidation({
        title: "Gift",
        originalUrl: "http://example.com/product",
      })
    ).not.toThrow();
  });
});
