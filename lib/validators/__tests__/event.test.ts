import { describe, it, expect } from "vitest";
import { createEventSchema } from "../event";

const FUTURE_DATE = "2030-06-15";
const VALID_SLUG = "john-jane-2025";

describe("createEventSchema", () => {
  it("accepts valid payload", () => {
    const result = createEventSchema.safeParse({
      coupleName: "John & Jane",
      weddingDate: FUTURE_DATE,
      slug: VALID_SLUG,
    });
    expect(result.success).toBe(true);
  });

  it("rejects slug shorter than 3 chars", () => {
    const result = createEventSchema.safeParse({
      coupleName: "John & Jane",
      weddingDate: FUTURE_DATE,
      slug: "ab",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("3");
    }
  });

  it("rejects slug longer than 50 chars", () => {
    const result = createEventSchema.safeParse({
      coupleName: "John & Jane",
      weddingDate: FUTURE_DATE,
      slug: "a".repeat(51),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("50");
    }
  });

  it("rejects slug with uppercase", () => {
    const result = createEventSchema.safeParse({
      coupleName: "John & Jane",
      weddingDate: FUTURE_DATE,
      slug: "MySlug",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/lowercase|letters|hyphens/i);
    }
  });

  it("rejects slug with spaces", () => {
    const result = createEventSchema.safeParse({
      coupleName: "John & Jane",
      weddingDate: FUTURE_DATE,
      slug: "my slug",
    });
    expect(result.success).toBe(false);
  });

  it("rejects slug with special chars", () => {
    const result = createEventSchema.safeParse({
      coupleName: "John & Jane",
      weddingDate: FUTURE_DATE,
      slug: "my@slug!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects past wedding date", () => {
    const result = createEventSchema.safeParse({
      coupleName: "John & Jane",
      weddingDate: "2020-01-01",
      slug: VALID_SLUG,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message?.match(/future/i))).toBe(true);
    }
  });

  it("rejects wedding date and time combined in the past", () => {
    const result = createEventSchema.safeParse({
      coupleName: "John & Jane",
      weddingDate: "2020-01-01",
      weddingTime: "14:00",
      slug: VALID_SLUG,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message?.match(/future/i))).toBe(true);
    }
  });

  it("rejects rsvp deadline in the past", () => {
    const result = createEventSchema.safeParse({
      coupleName: "John & Jane",
      weddingDate: FUTURE_DATE,
      slug: VALID_SLUG,
      rsvpDeadline: "2020-01-01",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message?.match(/RSVP.*future/i))).toBe(true);
    }
  });

  it("rejects rsvp deadline after wedding date", () => {
    const result = createEventSchema.safeParse({
      coupleName: "John & Jane",
      weddingDate: FUTURE_DATE,
      slug: VALID_SLUG,
      rsvpDeadline: "2030-07-01",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message?.match(/before the wedding/i))).toBe(true);
    }
  });

  it("accepts valid rsvp deadline before wedding date", () => {
    const result = createEventSchema.safeParse({
      coupleName: "John & Jane",
      weddingDate: FUTURE_DATE,
      slug: VALID_SLUG,
      rsvpDeadline: "2030-06-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty couple name", () => {
    const result = createEventSchema.safeParse({
      coupleName: "",
      weddingDate: FUTURE_DATE,
      slug: VALID_SLUG,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/required|Couple/i);
    }
  });

  it("accepts valid coManagerEmail when provided", () => {
    const result = createEventSchema.safeParse({
      coupleName: "John & Jane",
      weddingDate: FUTURE_DATE,
      slug: VALID_SLUG,
      coManagerEmail: "partner@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid coManagerEmail when provided", () => {
    const result = createEventSchema.safeParse({
      coupleName: "John & Jane",
      weddingDate: FUTURE_DATE,
      slug: VALID_SLUG,
      coManagerEmail: "not-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/Invalid email/i);
    }
  });

  it("accepts when coManagerEmail is omitted", () => {
    const result = createEventSchema.safeParse({
      coupleName: "John & Jane",
      weddingDate: FUTURE_DATE,
      slug: VALID_SLUG,
    });
    expect(result.success).toBe(true);
  });
});
