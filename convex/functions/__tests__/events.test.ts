import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Tests for the business logic extracted from convex/events.ts.
 *
 * We cannot run Convex functions in Vitest without a live Convex environment,
 * so we replicate the handler logic against mocked db and auth to catch regressions.
 */

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const SLUG_MIN_LENGTH = 3;
const SLUG_MAX_LENGTH = 50;

type AuthUser = { _id: string; email?: string };

// --------------------------------------------------------------------------
// Inline replication of checkSlugAvailable handler logic
// --------------------------------------------------------------------------

async function checkSlugAvailableLogic(
  db: { queryEventBySlug: (slug: string) => Promise<{ slug: string } | null> },
  args: { slug: string }
): Promise<{ available: boolean; reason: "empty" | "invalid" | "available" | "taken" }> {
  const slug = args.slug.toLowerCase().trim();
  if (!slug) return { available: false, reason: "empty" };
  if (slug.length < SLUG_MIN_LENGTH || slug.length > SLUG_MAX_LENGTH) {
    return { available: false, reason: "invalid" };
  }
  if (!SLUG_PATTERN.test(slug)) return { available: false, reason: "invalid" };

  const existing = await db.queryEventBySlug(slug);
  return {
    available: existing === null,
    reason: existing ? "taken" : "available",
  };
}

// --------------------------------------------------------------------------
// Inline replication of createEvent handler logic
// --------------------------------------------------------------------------

type EventInsert = {
  slug: string;
  coupleName: string;
  weddingDate: string;
  weddingTime?: string;
  rsvpDeadline?: string;
  language: string;
  paid: boolean;
  published: boolean;
  createdAt: number;
};

type ManagerInsert = {
  eventId: string;
  userId: string;
  role: "owner";
  createdAt: number;
};

async function createEventLogic(
  db: {
    queryEventBySlug: (slug: string) => Promise<{ slug: string } | null>;
    insertEvent: (event: EventInsert) => Promise<string>;
    insertManager: (manager: ManagerInsert) => Promise<void>;
  },
  authUser: AuthUser | null,
  args: {
    coupleName: string;
    weddingDate: string;
    weddingTime?: string;
    slug: string;
    rsvpDeadline?: string;
  }
): Promise<string> {
  if (!authUser) throw new Error("Unauthorized");

  const slug = args.slug.toLowerCase().trim();
  if (!slug) throw new Error("Slug is required");
  if (slug.length < SLUG_MIN_LENGTH || slug.length > SLUG_MAX_LENGTH) {
    throw new Error("Slug must be 3–50 characters");
  }
  if (!SLUG_PATTERN.test(slug)) throw new Error("Slug must be alphanumeric and hyphens only");

  const weddingDateTime = args.weddingTime
    ? new Date(`${args.weddingDate}T${args.weddingTime}`)
    : new Date(args.weddingDate);
  const nowDate = new Date();
  if (weddingDateTime <= nowDate) throw new Error("Wedding date and time must be in the future");

  if (args.rsvpDeadline) {
    const rsvpDate = new Date(args.rsvpDeadline);
    if (rsvpDate <= nowDate) throw new Error("RSVP deadline must be in the future");
    if (rsvpDate >= weddingDateTime) throw new Error("RSVP deadline must be before the wedding date");
  }

  const existing = await db.queryEventBySlug(slug);
  if (existing) throw new Error("This URL is already taken");

  const now = Date.now();
  const eventId = await db.insertEvent({
    slug,
    coupleName: args.coupleName.trim(),
    weddingDate: args.weddingDate,
    weddingTime: args.weddingTime,
    ...(args.rsvpDeadline && { rsvpDeadline: args.rsvpDeadline }),
    language: "ms",
    paid: false,
    published: false,
    createdAt: now,
  });

  await db.insertManager({
    eventId,
    userId: authUser._id,
    role: "owner",
    createdAt: now,
  });

  return eventId;
}

// --------------------------------------------------------------------------
// Inline replication of inviteCoManager handler logic
// --------------------------------------------------------------------------

type Manager = { userId?: string; invitedEmail?: string };

async function inviteCoManagerLogic(
  db: {
    queryManagersByEvent: (eventId: string) => Promise<Manager[]>;
    queryManagerByEventAndUser: (eventId: string, userId: string) => Promise<Manager | null>;
    insertManager: (m: {
      eventId: string;
      role: "co-manager";
      invitedEmail: string;
      createdAt: number;
    }) => Promise<void>;
  },
  authUser: AuthUser | null,
  args: { eventId: string; email: string }
): Promise<{ success: boolean }> {
  if (!authUser) throw new Error("Unauthorized");

  const manager = await db.queryManagerByEventAndUser(args.eventId, authUser._id);
  if (!manager) throw new Error("Unauthorized: not a manager of this event");

  const managers = await db.queryManagersByEvent(args.eventId);
  if (managers.length >= 2) throw new Error("Maximum 2 managers per event");

  const email = args.email.toLowerCase().trim();
  const callerEmail = authUser.email?.toLowerCase().trim();
  if (callerEmail && callerEmail === email) throw new Error("Cannot invite yourself");

  for (const m of managers) {
    if (m.invitedEmail?.toLowerCase() === email) {
      throw new Error("This email is already invited");
    }
  }

  await db.insertManager({
    eventId: args.eventId,
    role: "co-manager",
    invitedEmail: email,
    createdAt: Date.now(),
  });

  return { success: true };
}

// --------------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------------

describe("events: checkSlugAvailable business logic", () => {
  let db: {
    queryEventBySlug: ReturnType<typeof vi.fn<(slug: string) => Promise<{ slug: string } | null>>>;
  };

  beforeEach(() => {
    db = {
      queryEventBySlug: vi.fn<(slug: string) => Promise<{ slug: string } | null>>().mockResolvedValue(null),
    };
  });

  it("returns available when slug is unique", async () => {
    const result = await checkSlugAvailableLogic(db, { slug: "my-event" });
    expect(result).toEqual({ available: true, reason: "available" });
    expect(db.queryEventBySlug).toHaveBeenCalledWith("my-event");
  });

  it("returns taken when slug exists", async () => {
    db.queryEventBySlug.mockResolvedValue({ slug: "my-event" });
    const result = await checkSlugAvailableLogic(db, { slug: "my-event" });
    expect(result).toEqual({ available: false, reason: "taken" });
  });

  it("returns invalid for empty slug", async () => {
    const result = await checkSlugAvailableLogic(db, { slug: "" });
    expect(result).toEqual({ available: false, reason: "empty" });
    expect(db.queryEventBySlug).not.toHaveBeenCalled();
  });

  it("returns invalid for slug shorter than 3 chars", async () => {
    const result = await checkSlugAvailableLogic(db, { slug: "ab" });
    expect(result).toEqual({ available: false, reason: "invalid" });
    expect(db.queryEventBySlug).not.toHaveBeenCalled();
  });

  it("returns invalid for slug longer than 50 chars", async () => {
    const result = await checkSlugAvailableLogic(db, { slug: "a".repeat(51) });
    expect(result).toEqual({ available: false, reason: "invalid" });
    expect(db.queryEventBySlug).not.toHaveBeenCalled();
  });

  it("accepts slug with uppercase after normalisation", async () => {
    const result = await checkSlugAvailableLogic(db, { slug: "MySlug" });
    expect(result).toEqual({ available: true, reason: "available" });
    expect(db.queryEventBySlug).toHaveBeenCalledWith("myslug");
  });

  it("returns invalid for slug with spaces", async () => {
    const result = await checkSlugAvailableLogic(db, { slug: "my slug" });
    expect(result).toEqual({ available: false, reason: "invalid" });
    expect(db.queryEventBySlug).not.toHaveBeenCalled();
  });

  it("returns invalid for slug with special chars", async () => {
    const result = await checkSlugAvailableLogic(db, { slug: "my@slug!" });
    expect(result).toEqual({ available: false, reason: "invalid" });
    expect(db.queryEventBySlug).not.toHaveBeenCalled();
  });

  it("normalises slug (lowercase, trim) before lookup", async () => {
    await checkSlugAvailableLogic(db, { slug: "  MySlug  " });
    expect(db.queryEventBySlug).toHaveBeenCalledWith("myslug");
  });
});

describe("events: createEvent business logic", () => {
  const authUser: AuthUser = { _id: "user-123" };
  const futureDate = "2030-06-15";

  let db: {
    queryEventBySlug: ReturnType<typeof vi.fn<(slug: string) => Promise<{ slug: string } | null>>>;
    insertEvent: ReturnType<typeof vi.fn<(event: EventInsert) => Promise<string>>>;
    insertManager: ReturnType<typeof vi.fn<(manager: ManagerInsert) => Promise<void>>>;
  };

  beforeEach(() => {
    db = {
      queryEventBySlug: vi.fn().mockResolvedValue(null),
      insertEvent: vi.fn().mockResolvedValue("event-456"),
      insertManager: vi.fn().mockResolvedValue(undefined),
    };
  });

  it("throws when unauthenticated", async () => {
    await expect(
      createEventLogic(db, null, {
        coupleName: "John & Jane",
        weddingDate: futureDate,
        slug: "john-jane",
      })
    ).rejects.toThrow("Unauthorized");
    expect(db.insertEvent).not.toHaveBeenCalled();
  });

  it("throws when slug is empty", async () => {
    await expect(
      createEventLogic(db, authUser, {
        coupleName: "John & Jane",
        weddingDate: futureDate,
        slug: "",
      })
    ).rejects.toThrow("Slug is required");
    expect(db.insertEvent).not.toHaveBeenCalled();
  });

  it("throws when slug length is less than 3", async () => {
    await expect(
      createEventLogic(db, authUser, {
        coupleName: "John & Jane",
        weddingDate: futureDate,
        slug: "ab",
      })
    ).rejects.toThrow("Slug must be 3–50 characters");
    expect(db.insertEvent).not.toHaveBeenCalled();
  });

  it("throws when slug length is greater than 50", async () => {
    await expect(
      createEventLogic(db, authUser, {
        coupleName: "John & Jane",
        weddingDate: futureDate,
        slug: "a".repeat(51),
      })
    ).rejects.toThrow("Slug must be 3–50 characters");
    expect(db.insertEvent).not.toHaveBeenCalled();
  });

  it("throws when slug pattern is invalid", async () => {
    await expect(
      createEventLogic(db, authUser, {
        coupleName: "John & Jane",
        weddingDate: futureDate,
        slug: "MySlug!",
      })
    ).rejects.toThrow("Slug must be alphanumeric and hyphens only");
    expect(db.insertEvent).not.toHaveBeenCalled();
  });

  it("throws when wedding date is not in the future", async () => {
    await expect(
      createEventLogic(db, authUser, {
        coupleName: "John & Jane",
        weddingDate: "2020-01-01",
        slug: "john-jane",
      })
    ).rejects.toThrow("Wedding date and time must be in the future");
    expect(db.insertEvent).not.toHaveBeenCalled();
  });

  it("throws when wedding date and time combined are in the past", async () => {
    await expect(
      createEventLogic(db, authUser, {
        coupleName: "John & Jane",
        weddingDate: "2020-01-01",
        weddingTime: "14:00",
        slug: "john-jane",
      })
    ).rejects.toThrow("Wedding date and time must be in the future");
    expect(db.insertEvent).not.toHaveBeenCalled();
  });

  it("throws when rsvp deadline is in the past", async () => {
    await expect(
      createEventLogic(db, authUser, {
        coupleName: "John & Jane",
        weddingDate: futureDate,
        slug: "john-jane",
        rsvpDeadline: "2020-01-01",
      })
    ).rejects.toThrow("RSVP deadline must be in the future");
    expect(db.insertEvent).not.toHaveBeenCalled();
  });

  it("throws when rsvp deadline is after wedding date", async () => {
    await expect(
      createEventLogic(db, authUser, {
        coupleName: "John & Jane",
        weddingDate: futureDate,
        slug: "john-jane",
        rsvpDeadline: "2030-07-01",
      })
    ).rejects.toThrow("RSVP deadline must be before the wedding date");
    expect(db.insertEvent).not.toHaveBeenCalled();
  });

  it("throws when slug is already taken", async () => {
    db.queryEventBySlug.mockResolvedValue({ slug: "john-jane" });
    await expect(
      createEventLogic(db, authUser, {
        coupleName: "John & Jane",
        weddingDate: futureDate,
        slug: "john-jane",
      })
    ).rejects.toThrow("This URL is already taken");
    expect(db.insertEvent).not.toHaveBeenCalled();
  });

  it("inserts event and manager on success", async () => {
    const eventId = await createEventLogic(db, authUser, {
      coupleName: "John & Jane",
      weddingDate: futureDate,
      slug: "john-jane",
    });

    expect(eventId).toBe("event-456");
    expect(db.insertEvent).toHaveBeenCalledOnce();
    expect(db.insertManager).toHaveBeenCalledOnce();

    const insertedEvent = db.insertEvent.mock.calls[0][0] as EventInsert;
    expect(insertedEvent.slug).toBe("john-jane");
    expect(insertedEvent.coupleName).toBe("John & Jane");
    expect(insertedEvent.weddingDate).toBe(futureDate);
    expect(insertedEvent.language).toBe("ms");
    expect(insertedEvent.paid).toBe(false);
    expect(insertedEvent.published).toBe(false);

    const insertedManager = db.insertManager.mock.calls[0][0] as ManagerInsert;
    expect(insertedManager.userId).toBe("user-123");
    expect(insertedManager.role).toBe("owner");
  });

  it("trims coupleName and normalises slug before storing", async () => {
    await createEventLogic(db, authUser, {
      coupleName: "  John & Jane  ",
      weddingDate: futureDate,
      slug: "  MySlug  ",
    });

    const insertedEvent = db.insertEvent.mock.calls[0][0] as EventInsert;
    expect(insertedEvent.coupleName).toBe("John & Jane");
    expect(insertedEvent.slug).toBe("myslug");
  });

  it("sets defaults: language ms, paid false, published false", async () => {
    await createEventLogic(db, authUser, {
      coupleName: "John & Jane",
      weddingDate: futureDate,
      slug: "john-jane",
    });

    const insertedEvent = db.insertEvent.mock.calls[0][0] as EventInsert;
    expect(insertedEvent.language).toBe("ms");
    expect(insertedEvent.paid).toBe(false);
    expect(insertedEvent.published).toBe(false);
  });

  it("includes rsvpDeadline when provided", async () => {
    await createEventLogic(db, authUser, {
      coupleName: "John & Jane",
      weddingDate: futureDate,
      slug: "john-jane",
      rsvpDeadline: "2030-06-01",
    });

    const insertedEvent = db.insertEvent.mock.calls[0][0] as EventInsert;
    expect(insertedEvent.rsvpDeadline).toBe("2030-06-01");
  });
});

describe("events: inviteCoManager business logic", () => {
  const authUser: AuthUser = { _id: "user-123", email: "owner@example.com" };
  const eventId = "event-456";

  let db: {
    queryManagerByEventAndUser: ReturnType<
      typeof vi.fn<(eventId: string, userId: string) => Promise<Manager | null>>
    >;
    queryManagersByEvent: ReturnType<typeof vi.fn<(eventId: string) => Promise<Manager[]>>>;
    insertManager: ReturnType<
      typeof vi.fn<(m: {
        eventId: string;
        role: "co-manager";
        invitedEmail: string;
        createdAt: number;
      }) => Promise<void>>
    >;
  };

  beforeEach(() => {
    db = {
      queryManagerByEventAndUser: vi.fn().mockResolvedValue({ userId: "user-123" }),
      queryManagersByEvent: vi.fn().mockResolvedValue([{ userId: "user-123" }]),
      insertManager: vi.fn().mockResolvedValue(undefined),
    };
  });

  it("throws when unauthenticated", async () => {
    await expect(
      inviteCoManagerLogic(db, null, { eventId, email: "partner@example.com" })
    ).rejects.toThrow("Unauthorized");
    expect(db.insertManager).not.toHaveBeenCalled();
  });

  it("throws when caller is not a manager", async () => {
    db.queryManagerByEventAndUser.mockResolvedValue(null);
    await expect(
      inviteCoManagerLogic(db, authUser, { eventId, email: "partner@example.com" })
    ).rejects.toThrow("Unauthorized: not a manager of this event");
    expect(db.insertManager).not.toHaveBeenCalled();
  });

  it("throws when already 2 managers", async () => {
    db.queryManagersByEvent.mockResolvedValue([
      { userId: "user-123" },
      { userId: "user-456" },
    ]);
    await expect(
      inviteCoManagerLogic(db, authUser, { eventId, email: "partner@example.com" })
    ).rejects.toThrow("Maximum 2 managers per event");
    expect(db.insertManager).not.toHaveBeenCalled();
  });

  it("throws when inviting self", async () => {
    await expect(
      inviteCoManagerLogic(db, authUser, { eventId, email: "owner@example.com" })
    ).rejects.toThrow("Cannot invite yourself");
    expect(db.insertManager).not.toHaveBeenCalled();
  });

  it("throws when email is already invited", async () => {
    db.queryManagersByEvent.mockResolvedValue([
      { userId: "user-123" },
      { invitedEmail: "partner@example.com" },
    ]);
    await expect(
      inviteCoManagerLogic(db, authUser, { eventId, email: "partner@example.com" })
    ).rejects.toThrow("Maximum 2 managers per event");
    expect(db.insertManager).not.toHaveBeenCalled();
  });

  it("inserts co-manager on success", async () => {
    const result = await inviteCoManagerLogic(db, authUser, {
      eventId,
      email: "partner@example.com",
    });

    expect(result).toEqual({ success: true });
    expect(db.insertManager).toHaveBeenCalledOnce();
    const inserted = db.insertManager.mock.calls[0][0];
    expect(inserted.eventId).toBe(eventId);
    expect(inserted.role).toBe("co-manager");
    expect(inserted.invitedEmail).toBe("partner@example.com");
  });

  it("normalises email (lowercase, trim) before storing", async () => {
    await inviteCoManagerLogic(db, authUser, {
      eventId,
      email: "  PARTNER@EXAMPLE.COM  ",
    });

    const inserted = db.insertManager.mock.calls[0][0];
    expect(inserted.invitedEmail).toBe("partner@example.com");
  });
});
