import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Tests for wishes business logic (addWish).
 * Replicates handler logic against mocked db to catch regressions.
 */

const MAX_MESSAGE_LENGTH = 255;

type Event = { _id: string; published: boolean };

async function addWishLogic(
  db: {
    getEvent: (eventId: string) => Promise<Event | null>;
    insertWish: (wish: {
      eventId: string;
      guestName: string;
      message: string;
      createdAt: number;
    }) => Promise<void>;
  },
  args: {
    eventId: string;
    guestName: string;
    message: string;
  }
): Promise<void> {
  const name = args.guestName.trim();
  if (!name || name.length > 100) {
    throw new Error("Please enter your name (max 100 characters)");
  }

  const message = args.message.trim();
  if (!message) throw new Error("Wish cannot be empty");
  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Wish cannot exceed ${MAX_MESSAGE_LENGTH} characters`);
  }

  const event = await db.getEvent(args.eventId);
  if (!event) throw new Error("Event not found");
  if (!event.published) throw new Error("Event not found");

  await db.insertWish({
    eventId: args.eventId,
    guestName: name,
    message,
    createdAt: Date.now(),
  });
}

describe("wishes: addWish business logic", () => {
  const eventId = "event-123";

  let db: {
    getEvent: ReturnType<typeof vi.fn<(id: string) => Promise<Event | null>>>;
    insertWish: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    db = {
      getEvent: vi.fn().mockResolvedValue({ _id: eventId, published: true }),
      insertWish: vi.fn().mockResolvedValue(undefined),
    };
  });

  it("rejects empty guest name", async () => {
    await expect(
      addWishLogic(db, {
        eventId,
        guestName: "   ",
        message: "Congratulations!",
      })
    ).rejects.toThrow("Please enter your name");
    expect(db.insertWish).not.toHaveBeenCalled();
  });

  it("rejects guest name exceeding 100 chars", async () => {
    await expect(
      addWishLogic(db, {
        eventId,
        guestName: "a".repeat(101),
        message: "Congratulations!",
      })
    ).rejects.toThrow("max 100 characters");
    expect(db.insertWish).not.toHaveBeenCalled();
  });

  it("rejects empty message", async () => {
    await expect(
      addWishLogic(db, {
        eventId,
        guestName: "Ahmad",
        message: "   ",
      })
    ).rejects.toThrow("Wish cannot be empty");
    expect(db.insertWish).not.toHaveBeenCalled();
  });

  it("rejects message exceeding 255 chars", async () => {
    await expect(
      addWishLogic(db, {
        eventId,
        guestName: "Ahmad",
        message: "a".repeat(256),
      })
    ).rejects.toThrow(`Wish cannot exceed ${MAX_MESSAGE_LENGTH} characters`);
    expect(db.insertWish).not.toHaveBeenCalled();
  });

  it("rejects when event not found", async () => {
    db.getEvent.mockResolvedValue(null);
    await expect(
      addWishLogic(db, {
        eventId,
        guestName: "Ahmad",
        message: "Congratulations!",
      })
    ).rejects.toThrow("Event not found");
    expect(db.insertWish).not.toHaveBeenCalled();
  });

  it("rejects when event not published", async () => {
    db.getEvent.mockResolvedValue({ _id: eventId, published: false });
    await expect(
      addWishLogic(db, {
        eventId,
        guestName: "Ahmad",
        message: "Congratulations!",
      })
    ).rejects.toThrow("Event not found");
    expect(db.insertWish).not.toHaveBeenCalled();
  });

  it("accepts valid wish and inserts", async () => {
    await addWishLogic(db, {
      eventId,
      guestName: "Ahmad",
      message: "Congratulations on your wedding!",
    });

    expect(db.insertWish).toHaveBeenCalledOnce();
    const inserted = db.insertWish.mock.calls[0][0];
    expect(inserted.eventId).toBe(eventId);
    expect(inserted.guestName).toBe("Ahmad");
    expect(inserted.message).toBe("Congratulations on your wedding!");
    expect(typeof inserted.createdAt).toBe("number");
  });

  it("accepts message at max length (255 chars)", async () => {
    const message = "a".repeat(255);
    await addWishLogic(db, {
      eventId,
      guestName: "Ahmad",
      message,
    });

    expect(db.insertWish).toHaveBeenCalledOnce();
    const inserted = db.insertWish.mock.calls[0][0];
    expect(inserted.message).toHaveLength(255);
  });

  it("trims guest name and message before storing", async () => {
    await addWishLogic(db, {
      eventId,
      guestName: "  Ahmad  ",
      message: "  Congratulations!  ",
    });

    const inserted = db.insertWish.mock.calls[0][0];
    expect(inserted.guestName).toBe("Ahmad");
    expect(inserted.message).toBe("Congratulations!");
  });
});
