import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Tests for RSVP business logic (submitRSVP).
 * Replicates handler logic against mocked db to catch regressions.
 */

const PAX_MIN = 1;
const PAX_MAX = 10;

type Event = { _id: string; rsvpDeadline?: string; published?: boolean };

async function submitRSVPLogic(
  db: {
    getEvent: (eventId: string) => Promise<Event | null>;
    queryRsvpsByEvent: (eventId: string) => Promise<{ guestName: string }[]>;
    insertRsvp: (rsvp: {
      eventId: string;
      guestName: string;
      attending: boolean;
      paxCount: number;
      submittedAt: number;
    }) => Promise<void>;
  },
  args: {
    eventId: string;
    guestName: string;
    attending: boolean;
    paxCount: number;
  }
): Promise<void> {
  const name = args.guestName.trim();
  if (!name || name.length > 100) {
    throw new Error("Please enter your name (max 100 characters)");
  }

  if (args.attending && (args.paxCount < PAX_MIN || args.paxCount > PAX_MAX)) {
    throw new Error("Number of guests must be between 1 and 10");
  }

  const event = await db.getEvent(args.eventId);
  if (!event) throw new Error("Event not found");
  if (!event.published) throw new Error("Event not found");

  if (event.rsvpDeadline) {
    const deadline = new Date(event.rsvpDeadline);
    if (Date.now() > deadline.getTime()) {
      throw new Error("RSVP deadline has passed");
    }
  }

  const rsvps = await db.queryRsvpsByEvent(args.eventId);
  const existing = rsvps.some(
    (r) => r.guestName.toLowerCase() === name.toLowerCase()
  );
  if (existing) {
    throw new Error("You have already submitted your RSVP");
  }

  const paxCount = args.attending ? args.paxCount : 0;

  await db.insertRsvp({
    eventId: args.eventId,
    guestName: name,
    attending: args.attending,
    paxCount,
    submittedAt: Date.now(),
  });
}

describe("rsvps: submitRSVP business logic", () => {
  const eventId = "event-123";
  const futureDeadline = "2030-12-31T23:59:59.000Z";

  let db: {
    getEvent: ReturnType<typeof vi.fn<(id: string) => Promise<Event | null>>>;
    queryRsvpsByEvent: ReturnType<
      typeof vi.fn<(id: string) => Promise<{ guestName: string }[]>>
    >;
    insertRsvp: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2030-06-01T12:00:00.000Z"));

    db = {
      getEvent: vi.fn().mockResolvedValue({
        _id: eventId,
        rsvpDeadline: futureDeadline,
        published: true,
      }),
      queryRsvpsByEvent: vi.fn().mockResolvedValue([]),
      insertRsvp: vi.fn().mockResolvedValue(undefined),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("throws when guest name is empty", async () => {
    await expect(
      submitRSVPLogic(db, {
        eventId,
        guestName: "   ",
        attending: true,
        paxCount: 2,
      })
    ).rejects.toThrow("Please enter your name");
    expect(db.insertRsvp).not.toHaveBeenCalled();
  });

  it("throws when guest name exceeds 100 chars", async () => {
    await expect(
      submitRSVPLogic(db, {
        eventId,
        guestName: "a".repeat(101),
        attending: true,
        paxCount: 2,
      })
    ).rejects.toThrow("max 100 characters");
    expect(db.insertRsvp).not.toHaveBeenCalled();
  });

  it("throws when attending and paxCount is 0", async () => {
    await expect(
      submitRSVPLogic(db, {
        eventId,
        guestName: "Ahmad",
        attending: true,
        paxCount: 0,
      })
    ).rejects.toThrow("Number of guests must be between 1 and 10");
    expect(db.insertRsvp).not.toHaveBeenCalled();
  });

  it("throws when attending and paxCount is 11", async () => {
    await expect(
      submitRSVPLogic(db, {
        eventId,
        guestName: "Ahmad",
        attending: true,
        paxCount: 11,
      })
    ).rejects.toThrow("Number of guests must be between 1 and 10");
    expect(db.insertRsvp).not.toHaveBeenCalled();
  });

  it("accepts paxCount 1 when attending", async () => {
    await submitRSVPLogic(db, {
      eventId,
      guestName: "Ahmad",
      attending: true,
      paxCount: 1,
    });
    expect(db.insertRsvp).toHaveBeenCalledOnce();
    const inserted = db.insertRsvp.mock.calls[0][0];
    expect(inserted.paxCount).toBe(1);
  });

  it("accepts paxCount 10 when attending", async () => {
    await submitRSVPLogic(db, {
      eventId,
      guestName: "Ahmad",
      attending: true,
      paxCount: 10,
    });
    expect(db.insertRsvp).toHaveBeenCalledOnce();
    const inserted = db.insertRsvp.mock.calls[0][0];
    expect(inserted.paxCount).toBe(10);
  });

  it("throws when event is not published", async () => {
    db.getEvent.mockResolvedValue({
      _id: eventId,
      rsvpDeadline: futureDeadline,
      published: false,
    });
    await expect(
      submitRSVPLogic(db, {
        eventId,
        guestName: "Ahmad",
        attending: true,
        paxCount: 2,
      })
    ).rejects.toThrow("Event not found");
    expect(db.insertRsvp).not.toHaveBeenCalled();
  });

  it("throws when event not found", async () => {
    db.getEvent.mockResolvedValue(null);
    await expect(
      submitRSVPLogic(db, {
        eventId,
        guestName: "Ahmad",
        attending: true,
        paxCount: 2,
      })
    ).rejects.toThrow("Event not found");
    expect(db.insertRsvp).not.toHaveBeenCalled();
  });

  it("throws when RSVP deadline has passed", async () => {
    db.getEvent.mockResolvedValue({
      _id: eventId,
      rsvpDeadline: "2030-01-01T00:00:00.000Z",
      published: true,
    });
    await expect(
      submitRSVPLogic(db, {
        eventId,
        guestName: "Ahmad",
        attending: true,
        paxCount: 2,
      })
    ).rejects.toThrow("RSVP deadline has passed");
    expect(db.insertRsvp).not.toHaveBeenCalled();
  });

  it("throws when duplicate RSVP (same name, case-insensitive)", async () => {
    db.queryRsvpsByEvent.mockResolvedValue([{ guestName: "Ahmad" }]);
    await expect(
      submitRSVPLogic(db, {
        eventId,
        guestName: "ahmad",
        attending: true,
        paxCount: 2,
      })
    ).rejects.toThrow("already submitted your RSVP");
    expect(db.insertRsvp).not.toHaveBeenCalled();
  });

  it("inserts RSVP on success (attending)", async () => {
    await submitRSVPLogic(db, {
      eventId,
      guestName: "Ahmad",
      attending: true,
      paxCount: 4,
    });

    expect(db.insertRsvp).toHaveBeenCalledOnce();
    const inserted = db.insertRsvp.mock.calls[0][0];
    expect(inserted.eventId).toBe(eventId);
    expect(inserted.guestName).toBe("Ahmad");
    expect(inserted.attending).toBe(true);
    expect(inserted.paxCount).toBe(4);
  });

  it("inserts RSVP with paxCount 0 when not attending", async () => {
    await submitRSVPLogic(db, {
      eventId,
      guestName: "Siti",
      attending: false,
      paxCount: 0,
    });

    expect(db.insertRsvp).toHaveBeenCalledOnce();
    const inserted = db.insertRsvp.mock.calls[0][0];
    expect(inserted.attending).toBe(false);
    expect(inserted.paxCount).toBe(0);
  });

  it("trims guest name before storing", async () => {
    await submitRSVPLogic(db, {
      eventId,
      guestName: "  Ahmad  ",
      attending: true,
      paxCount: 2,
    });

    const inserted = db.insertRsvp.mock.calls[0][0];
    expect(inserted.guestName).toBe("Ahmad");
  });
});
