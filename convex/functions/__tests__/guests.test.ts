import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Tests for guest import business logic (importGuests).
 * Replicates handler validation logic against mocked db to catch regressions.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type GuestRow = {
  name: string;
  phone?: string;
  email?: string;
  maxPax?: number;
};

async function importGuestsLogic(
  db: {
    insertGuest: (guest: {
      eventId: string;
      name: string;
      phone?: string;
      email?: string;
      maxPax: number;
      createdAt: number;
    }) => Promise<void>;
  },
  args: {
    eventId: string;
    guests: GuestRow[];
  }
): Promise<{ imported: number; errors: string[] }> {
  const errors: string[] = [];
  let imported = 0;
  const now = Date.now();

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
      await db.insertGuest({
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
}

describe("guests: importGuests business logic", () => {
  const eventId = "event-123";

  let db: {
    insertGuest: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    db = {
      insertGuest: vi.fn().mockResolvedValue(undefined),
    };
  });

  it("rejects row with empty name", async () => {
    const result = await importGuestsLogic(db, {
      eventId,
      guests: [{ name: "   " }],
    });

    expect(result.imported).toBe(0);
    expect(result.errors).toContain(
      "Row 1: Name is required and must be under 100 characters"
    );
    expect(db.insertGuest).not.toHaveBeenCalled();
  });

  it("rejects row with name exceeding 100 chars", async () => {
    const result = await importGuestsLogic(db, {
      eventId,
      guests: [{ name: "a".repeat(101) }],
    });

    expect(result.imported).toBe(0);
    expect(result.errors).toContain(
      "Row 1: Name is required and must be under 100 characters"
    );
    expect(db.insertGuest).not.toHaveBeenCalled();
  });

  it("rejects row with invalid email format", async () => {
    const result = await importGuestsLogic(db, {
      eventId,
      guests: [{ name: "Ahmad", email: "invalid-email" }],
    });

    expect(result.imported).toBe(0);
    expect(result.errors).toContain("Row 1: Invalid email format");
    expect(db.insertGuest).not.toHaveBeenCalled();
  });

  it("rejects row with maxPax less than 1", async () => {
    const result = await importGuestsLogic(db, {
      eventId,
      guests: [{ name: "Ahmad", maxPax: 0 }],
    });

    expect(result.imported).toBe(0);
    expect(result.errors).toContain("Row 1: Max pax must be 1–10");
    expect(db.insertGuest).not.toHaveBeenCalled();
  });

  it("rejects row with maxPax greater than 10", async () => {
    const result = await importGuestsLogic(db, {
      eventId,
      guests: [{ name: "Ahmad", maxPax: 11 }],
    });

    expect(result.imported).toBe(0);
    expect(result.errors).toContain("Row 1: Max pax must be 1–10");
    expect(db.insertGuest).not.toHaveBeenCalled();
  });

  it("accepts valid rows and returns imported count", async () => {
    const result = await importGuestsLogic(db, {
      eventId,
      guests: [
        { name: "Ahmad" },
        { name: "Siti", email: "siti@example.com" },
      ],
    });

    expect(result.imported).toBe(2);
    expect(result.errors).toHaveLength(0);
    expect(db.insertGuest).toHaveBeenCalledTimes(2);
  });

  it("partial import: valid rows imported, invalid rows reported in errors", async () => {
    const result = await importGuestsLogic(db, {
      eventId,
      guests: [
        { name: "Ahmad" },
        { name: "" },
        { name: "Siti", email: "invalid" },
        { name: "Ali", maxPax: 5 },
      ],
    });

    expect(result.imported).toBe(2);
    expect(result.errors).toContain(
      "Row 2: Name is required and must be under 100 characters"
    );
    expect(result.errors).toContain("Row 3: Invalid email format");
    expect(db.insertGuest).toHaveBeenCalledTimes(2);
  });

  it("trims name, phone, email before validation and insert", async () => {
    const result = await importGuestsLogic(db, {
      eventId,
      guests: [
        {
          name: "  Ahmad  ",
          phone: " 0123456789 ",
          email: " ahmad@example.com ",
        },
      ],
    });

    expect(result.imported).toBe(1);
    expect(result.errors).toHaveLength(0);
    const inserted = db.insertGuest.mock.calls[0][0];
    expect(inserted.name).toBe("Ahmad");
    expect(inserted.phone).toBe("0123456789");
    expect(inserted.email).toBe("ahmad@example.com");
  });

  it("uses default maxPax 10 when not provided", async () => {
    const result = await importGuestsLogic(db, {
      eventId,
      guests: [{ name: "Ahmad" }],
    });

    expect(result.imported).toBe(1);
    const inserted = db.insertGuest.mock.calls[0][0];
    expect(inserted.maxPax).toBe(10);
  });

  it("reports Failed to insert when db throws", async () => {
    db.insertGuest.mockRejectedValueOnce(new Error("DB error"));

    const result = await importGuestsLogic(db, {
      eventId,
      guests: [{ name: "Ahmad" }, { name: "Siti" }],
    });

    expect(result.imported).toBe(1);
    expect(result.errors).toContain("Row 1: Failed to insert");
  });
});
