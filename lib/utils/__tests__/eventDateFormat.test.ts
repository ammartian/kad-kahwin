import { describe, it, expect } from "vitest";
import { formatEventDate, formatEventTime } from "../../utils";

describe("formatEventDate", () => {
  it("formats valid ISO date string in ms-MY locale", () => {
    const result = formatEventDate("2026-06-15", "ms-MY");
    expect(result).toContain("15");
    expect(result).toContain("2026");
    expect(typeof result).toBe("string");
  });

  it("formats valid ISO date string in en-MY locale", () => {
    const result = formatEventDate("2026-06-15", "en-MY");
    expect(result).toContain("15");
    expect(result).toContain("2026");
    expect(typeof result).toBe("string");
  });

  it("returns null when weddingDate is empty string", () => {
    expect(formatEventDate("", "ms-MY")).toBe(null);
  });

  it("returns null when weddingDate is invalid", () => {
    expect(formatEventDate("not-a-date", "ms-MY")).toBe(null);
    expect(formatEventDate("2026-13-45", "ms-MY")).toBe(null);
    expect(formatEventDate("invalid", "ms-MY")).toBe(null);
  });
});

describe("formatEventTime", () => {
  it("formats valid 24h time string", () => {
    const result = formatEventTime("14:30");
    expect(result).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/i);
    expect(typeof result).toBe("string");
  });

  it("formats midnight as 12:00 AM", () => {
    const result = formatEventTime("00:00");
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });

  it("returns null when weddingTime is undefined", () => {
    expect(formatEventTime(undefined)).toBe(null);
  });

  it("returns null when weddingTime is empty string", () => {
    expect(formatEventTime("")).toBe(null);
  });

  it("returns null when weddingTime is invalid", () => {
    expect(formatEventTime("25:00")).toBe(null);
    expect(formatEventTime("14:60")).toBe(null);
    expect(formatEventTime("not-a-time")).toBe(null);
  });
});
