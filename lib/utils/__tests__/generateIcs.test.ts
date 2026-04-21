import { describe, it, expect } from "vitest";
import { generateIcsContent, buildGoogleCalendarUrl } from "../generateIcs";

describe("generateIcs: generateIcsContent", () => {
  it("produces valid ICS wrapper structure", () => {
    const content = generateIcsContent({
      title: "Ahmad & Siti Wedding",
      startDate: "2030-06-15",
      startTime: "14:00",
    });

    expect(content).toContain("BEGIN:VCALENDAR");
    expect(content).toContain("END:VCALENDAR");
    expect(content).toContain("BEGIN:VEVENT");
    expect(content).toContain("END:VEVENT");
    expect(content).toContain("VERSION:2.0");
    expect(content).toContain("CALSCALE:GREGORIAN");
  });

  it("includes SUMMARY with the event title", () => {
    const content = generateIcsContent({
      title: "Ahmad & Siti Wedding",
      startDate: "2030-06-15",
    });

    expect(content).toContain("SUMMARY:Ahmad & Siti Wedding");
  });

  it("includes DTSTART in UTC format", () => {
    const content = generateIcsContent({
      title: "Test",
      startDate: "2030-06-15",
      startTime: "14:00",
    });

    // 14:00 local without timezone offset — formatIcsDateTime uses UTC from ISO string
    expect(content).toMatch(/DTSTART:\d{8}T\d{6}Z/);
  });

  it("includes DTEND 4 hours after DTSTART", () => {
    const content = generateIcsContent({
      title: "Test",
      startDate: "2030-06-15",
      startTime: "10:00",
    });

    expect(content).toMatch(/DTEND:\d{8}T\d{6}Z/);
    // Verify DTEND is present and different from DTSTART
    const dtStart = content.match(/DTSTART:(\d{8}T\d{6}Z)/)?.[1];
    const dtEnd = content.match(/DTEND:(\d{8}T\d{6}Z)/)?.[1];
    expect(dtStart).toBeDefined();
    expect(dtEnd).toBeDefined();
    expect(dtStart).not.toBe(dtEnd);
  });

  it("includes LOCATION when venueName and venueAddress provided (comma is escaped per RFC 5545)", () => {
    const content = generateIcsContent({
      title: "Test",
      startDate: "2030-06-15",
      venueName: "Grand Ballroom KLCC",
      venueAddress: "50088 Kuala Lumpur",
    });

    // escapeIcsText escapes commas → \,
    expect(content).toContain("LOCATION:Grand Ballroom KLCC\\, 50088 Kuala Lumpur");
  });

  it("includes LOCATION with only venueName when venueAddress missing", () => {
    const content = generateIcsContent({
      title: "Test",
      startDate: "2030-06-15",
      venueName: "Grand Ballroom KLCC",
    });

    expect(content).toContain("LOCATION:Grand Ballroom KLCC");
  });

  it("omits LOCATION line when neither venueName nor venueAddress provided", () => {
    const content = generateIcsContent({
      title: "Test",
      startDate: "2030-06-15",
    });

    expect(content).not.toContain("LOCATION:");
  });

  it("includes DESCRIPTION when provided", () => {
    const content = generateIcsContent({
      title: "Test",
      startDate: "2030-06-15",
      description: "Majlis perkahwinan Ahmad & Siti",
    });

    expect(content).toContain("DESCRIPTION:Majlis perkahwinan Ahmad & Siti");
  });

  it("omits DESCRIPTION when not provided", () => {
    const content = generateIcsContent({
      title: "Test",
      startDate: "2030-06-15",
    });

    expect(content).not.toContain("DESCRIPTION:");
  });

  it("escapes semicolons in title", () => {
    const content = generateIcsContent({
      title: "Ahmad; Siti Wedding",
      startDate: "2030-06-15",
    });

    expect(content).toContain("SUMMARY:Ahmad\\; Siti Wedding");
  });

  it("escapes commas in title", () => {
    const content = generateIcsContent({
      title: "Ahmad, Siti Wedding",
      startDate: "2030-06-15",
    });

    expect(content).toContain("SUMMARY:Ahmad\\, Siti Wedding");
  });

  it("escapes backslashes in title", () => {
    const content = generateIcsContent({
      title: "Ahmad \\ Siti",
      startDate: "2030-06-15",
    });

    expect(content).toContain("SUMMARY:Ahmad \\\\ Siti");
  });

  it("uses CRLF line endings (RFC 5545 compliance)", () => {
    const content = generateIcsContent({
      title: "Test",
      startDate: "2030-06-15",
    });

    expect(content).toContain("\r\n");
  });

  it("includes UID field for event uniqueness", () => {
    const content = generateIcsContent({
      title: "Test",
      startDate: "2030-06-15",
    });

    expect(content).toMatch(/UID:\d+-kadkahwin@kadkahwin\.my/);
  });

  it("does not throw and produces valid DTSTART when startTime not provided", () => {
    const content = generateIcsContent({
      title: "Test",
      startDate: "2030-06-15",
    });

    // Should not throw and DTSTART must be a valid UTC timestamp
    expect(content).toMatch(/DTSTART:\d{8}T\d{6}Z/);
  });
});

describe("generateIcs: buildGoogleCalendarUrl", () => {
  it("returns a Google Calendar render URL", () => {
    const url = buildGoogleCalendarUrl({
      title: "Ahmad & Siti Wedding",
      startDate: "2030-06-15",
      startTime: "14:00",
    });

    expect(url).toContain("https://calendar.google.com/calendar/render");
    expect(url).toContain("action=TEMPLATE");
  });

  it("includes encoded event title", () => {
    const url = buildGoogleCalendarUrl({
      title: "Ahmad & Siti Wedding",
      startDate: "2030-06-15",
      startTime: "14:00",
    });

    expect(url).toContain("text=Ahmad+%26+Siti+Wedding");
  });

  it("includes dates parameter in START/END format", () => {
    const url = buildGoogleCalendarUrl({
      title: "Test",
      startDate: "2030-06-15",
      startTime: "10:00",
    });

    expect(url).toMatch(/dates=\d{8}T\d{6}Z%2F\d{8}T\d{6}Z/);
  });

  it("includes location when venueName and venueAddress provided", () => {
    const url = buildGoogleCalendarUrl({
      title: "Test",
      startDate: "2030-06-15",
      venueName: "Grand Ballroom KLCC",
      venueAddress: "50088 Kuala Lumpur",
    });

    expect(url).toContain("location=");
    expect(url).toContain("Grand+Ballroom+KLCC");
  });

  it("omits location parameter when no venue provided", () => {
    const url = buildGoogleCalendarUrl({
      title: "Test",
      startDate: "2030-06-15",
    });

    expect(url).not.toContain("location=");
  });

  it("includes description when provided", () => {
    const url = buildGoogleCalendarUrl({
      title: "Test",
      startDate: "2030-06-15",
      description: "Majlis perkahwinan Test",
    });

    expect(url).toContain("details=Majlis+perkahwinan+Test");
  });

  it("falls back to default description when none provided", () => {
    const url = buildGoogleCalendarUrl({
      title: "Ahmad & Siti",
      startDate: "2030-06-15",
    });

    expect(url).toContain("details=");
    expect(url).toContain("Ahmad");
  });
});
