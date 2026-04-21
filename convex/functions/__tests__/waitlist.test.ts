import { describe, it, expect, vi, beforeEach } from "vitest";
import { isValidEmail, normaliseEmail } from "../../../lib/utils/validateEmail";

/**
 * Tests for the business logic extracted from convex/waitlist.ts.
 *
 * We cannot run Convex functions in Vitest without a live Convex environment,
 * so we test the business rules directly via the extracted utilities and
 * replicate the handler logic against a mocked ctx.db to catch regressions.
 */

// --------------------------------------------------------------------------
// Inline replication of addToWaitlist handler logic (mirrors waitlist.ts)
// --------------------------------------------------------------------------

type WaitlistEntry = {
  email: string;
  subscribedAt: number;
  source: string;
  status: "pending" | "invited" | "converted";
};

async function addToWaitlistLogic(
  db: {
    queryByEmail: (email: string) => Promise<WaitlistEntry | null>;
    insert: (entry: WaitlistEntry) => Promise<string>;
  },
  args: { email: string; source?: string }
): Promise<{ success: boolean; id: string; email: string; message: string }> {
  const email = normaliseEmail(args.email);

  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  const existing = await db.queryByEmail(email);
  if (existing) {
    throw new Error("Email already subscribed to waitlist");
  }

  const id = await db.insert({
    email,
    subscribedAt: Date.now(),
    source: args.source ?? "landing-page",
    status: "pending",
  });

  return { success: true, id, email, message: "Successfully added to waitlist!" };
}

// --------------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------------

describe("waitlist: addToWaitlist business logic", () => {
  let db: {
    queryByEmail: ReturnType<typeof vi.fn<(email: string) => Promise<WaitlistEntry | null>>>;
    insert: ReturnType<typeof vi.fn<(entry: WaitlistEntry) => Promise<string>>>;
  };

  beforeEach(() => {
    db = {
      queryByEmail: vi.fn<(email: string) => Promise<WaitlistEntry | null>>().mockResolvedValue(null),
      insert: vi.fn<(entry: WaitlistEntry) => Promise<string>>().mockResolvedValue("mock-id-123"),
    };
  });

  it("successfully adds a valid new email", async () => {
    const result = await addToWaitlistLogic(db, { email: "test@example.com" });

    expect(result.success).toBe(true);
    expect(result.email).toBe("test@example.com");
    expect(result.id).toBe("mock-id-123");
    expect(db.insert).toHaveBeenCalledOnce();
  });

  it("normalises email to lowercase before insert", async () => {
    await addToWaitlistLogic(db, { email: "USER@EXAMPLE.COM" });

    const insertedEntry = db.insert.mock.calls[0][0] as WaitlistEntry;
    expect(insertedEntry.email).toBe("user@example.com");
  });

  it("trims whitespace from email before insert", async () => {
    await addToWaitlistLogic(db, { email: "  user@example.com  " });

    const insertedEntry = db.insert.mock.calls[0][0] as WaitlistEntry;
    expect(insertedEntry.email).toBe("user@example.com");
  });

  it("sets default source to landing-page when not provided", async () => {
    await addToWaitlistLogic(db, { email: "user@example.com" });

    const insertedEntry = db.insert.mock.calls[0][0] as WaitlistEntry;
    expect(insertedEntry.source).toBe("landing-page");
  });

  it("uses provided source when given", async () => {
    await addToWaitlistLogic(db, { email: "user@example.com", source: "hero-banner" });

    const insertedEntry = db.insert.mock.calls[0][0] as WaitlistEntry;
    expect(insertedEntry.source).toBe("hero-banner");
  });

  it("sets initial status to pending", async () => {
    await addToWaitlistLogic(db, { email: "user@example.com" });

    const insertedEntry = db.insert.mock.calls[0][0] as WaitlistEntry;
    expect(insertedEntry.status).toBe("pending");
  });

  it("rejects invalid email format", async () => {
    await expect(
      addToWaitlistLogic(db, { email: "not-an-email" })
    ).rejects.toThrow("Invalid email format");

    expect(db.insert).not.toHaveBeenCalled();
  });

  it("rejects email missing domain TLD", async () => {
    await expect(
      addToWaitlistLogic(db, { email: "user@nodomain" })
    ).rejects.toThrow("Invalid email format");
  });

  it("rejects empty email string", async () => {
    await expect(
      addToWaitlistLogic(db, { email: "" })
    ).rejects.toThrow("Invalid email format");
  });

  it("rejects duplicate email — already normalised form", async () => {
    db.queryByEmail.mockResolvedValue({
      email: "user@example.com",
      subscribedAt: Date.now(),
      source: "landing-page",
      status: "pending",
    });

    await expect(
      addToWaitlistLogic(db, { email: "user@example.com" })
    ).rejects.toThrow("Email already subscribed to waitlist");

    expect(db.insert).not.toHaveBeenCalled();
  });

  it("rejects duplicate email submitted in different case", async () => {
    db.queryByEmail.mockResolvedValue({
      email: "user@example.com",
      subscribedAt: Date.now(),
      source: "landing-page",
      status: "pending",
    });

    await expect(
      addToWaitlistLogic(db, { email: "USER@EXAMPLE.COM" })
    ).rejects.toThrow("Email already subscribed to waitlist");
  });

  it("duplicate check uses normalised email as the lookup key", async () => {
    await addToWaitlistLogic(db, { email: "  UPPER@EXAMPLE.COM  " });

    expect(db.queryByEmail).toHaveBeenCalledWith("upper@example.com");
  });
});
