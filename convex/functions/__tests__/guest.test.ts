import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Tests for the business logic extracted from convex/guest.ts.
 *
 * We replicate the handler logic against mocked db and storage to catch regressions.
 */

type EventDoc = {
  _id: string;
  _creationTime?: number;
  slug: string;
  coupleName: string;
  weddingDate: string;
  weddingTime?: string;
  venueName?: string;
  venueAddress?: string;
  locationWaze?: string;
  locationGoogle?: string;
  locationApple?: string;
  backgroundColor?: string;
  colorPrimary?: string;
  colorSecondary?: string;
  colorAccent?: string;
  musicYoutubeUrl?: string;
  rsvpDeadline?: string;
  language: "ms" | "en";
  published: boolean;
  backgroundImageId?: string;
  donationQrId?: string;
  carouselImageIds?: string[];
  bankName?: string;
  bankAccount?: string;
  bankHolder?: string;
};

type PublicEventResult = {
  _id: string;
  _creationTime?: number;
  slug: string;
  coupleName: string;
  weddingDate: string;
  weddingTime?: string;
  venueName?: string;
  venueAddress?: string;
  locationWaze?: string;
  locationGoogle?: string;
  locationApple?: string;
  backgroundColor?: string;
  colorPrimary?: string;
  colorSecondary?: string;
  colorAccent?: string;
  musicYoutubeUrl?: string;
  rsvpDeadline?: string;
  language: "ms" | "en";
  published: boolean;
  backgroundImageUrl: string | null;
  donationQrUrl: string | null;
  bankName?: string;
  bankAccount?: string;
  bankHolder?: string;
  carouselImageUrls: string[];
};

// Mirrors the explicit field allowlist in convex/guest.ts getEventBySlug
async function getEventBySlugLogic(
  db: { queryEventBySlug: (slug: string) => Promise<EventDoc | null> },
  storage: { getUrl: (id: string) => Promise<string | null> },
  args: { slug: string }
): Promise<PublicEventResult | null> {
  const slug = args.slug.toLowerCase().trim();
  const event = await db.queryEventBySlug(slug);

  if (!event || !event.published) return null;

  const [backgroundImageUrl, donationQrUrl] = await Promise.all([
    event.backgroundImageId ? storage.getUrl(event.backgroundImageId) : null,
    event.donationQrId ? storage.getUrl(event.donationQrId) : null,
  ]);

  const carouselImageUrls: string[] = [];
  if (event.carouselImageIds && event.carouselImageIds.length > 0) {
    const urls = await Promise.all(event.carouselImageIds.map((id) => storage.getUrl(id)));
    for (const url of urls) {
      if (url) carouselImageUrls.push(url);
    }
  }

  // Explicit allowlist — no storage IDs, no fields outside the list
  return {
    _id: event._id,
    _creationTime: event._creationTime,
    slug: event.slug,
    coupleName: event.coupleName,
    weddingDate: event.weddingDate,
    weddingTime: event.weddingTime,
    venueName: event.venueName,
    venueAddress: event.venueAddress,
    locationWaze: event.locationWaze,
    locationGoogle: event.locationGoogle,
    locationApple: event.locationApple,
    backgroundColor: event.backgroundColor,
    colorPrimary: event.colorPrimary,
    colorSecondary: event.colorSecondary,
    colorAccent: event.colorAccent,
    musicYoutubeUrl: event.musicYoutubeUrl,
    rsvpDeadline: event.rsvpDeadline,
    language: event.language,
    published: event.published,
    backgroundImageUrl,
    donationQrUrl,
    bankName: event.bankName,
    bankAccount: event.bankAccount,
    bankHolder: event.bankHolder,
    carouselImageUrls,
  };
}

// Mirrors the updateCarouselImages mutation logic
type AuthUser = { _id: string };

async function updateCarouselImagesLogic(
  db: {
    queryManagerByEventAndUser: (eventId: string, userId: string) => Promise<{ userId: string } | null>;
    patchEvent: (eventId: string, patch: { carouselImageIds: string[] }) => Promise<void>;
  },
  authUser: AuthUser | null,
  args: { eventId: string; imageIds: string[] }
): Promise<void> {
  if (!authUser) throw new Error("Unauthorized");
  const manager = await db.queryManagerByEventAndUser(args.eventId, authUser._id);
  if (!manager) throw new Error("Unauthorized: not a manager of this event");
  if (args.imageIds.length > 10) throw new Error("Maximum 10 carousel images allowed");
  await db.patchEvent(args.eventId, { carouselImageIds: args.imageIds });
}

describe("guest: getEventBySlug — field allowlist and URL resolution", () => {
  const baseEvent: EventDoc = {
    _id: "event-123",
    slug: "aminah-razak",
    coupleName: "Aminah & Razak",
    weddingDate: "2026-08-15",
    weddingTime: "14:00",
    language: "ms",
    published: true,
  };

  let db: { queryEventBySlug: ReturnType<typeof vi.fn<(slug: string) => Promise<EventDoc | null>>> };
  let storage: { getUrl: ReturnType<typeof vi.fn<(id: string) => Promise<string | null>>> };

  beforeEach(() => {
    db = { queryEventBySlug: vi.fn().mockResolvedValue(baseEvent) };
    storage = { getUrl: vi.fn().mockResolvedValue("https://cdn.example.com/img.jpg") };
  });

  it("returns null when event not found", async () => {
    db.queryEventBySlug.mockResolvedValue(null);
    const result = await getEventBySlugLogic(db, storage, { slug: "nonexistent" });
    expect(result).toBe(null);
  });

  it("returns null when event is not published", async () => {
    db.queryEventBySlug.mockResolvedValue({ ...baseEvent, published: false });
    const result = await getEventBySlugLogic(db, storage, { slug: "aminah-razak" });
    expect(result).toBe(null);
  });

  it("normalises slug to lowercase and trims before querying", async () => {
    await getEventBySlugLogic(db, storage, { slug: "  AMINAH-RAZAK  " });
    expect(db.queryEventBySlug).toHaveBeenCalledWith("aminah-razak");
  });

  it("does not expose raw storage IDs (backgroundImageId, donationQrId, carouselImageIds)", async () => {
    db.queryEventBySlug.mockResolvedValue({
      ...baseEvent,
      backgroundImageId: "storage-bg-123",
      donationQrId: "storage-qr-456",
      carouselImageIds: ["storage-c1", "storage-c2"],
    });

    const result = await getEventBySlugLogic(db, storage, { slug: "aminah-razak" });

    expect(result).not.toBe(null);
    expect(result).not.toHaveProperty("backgroundImageId");
    expect(result).not.toHaveProperty("donationQrId");
    expect(result).not.toHaveProperty("carouselImageIds");
  });

  it("resolves backgroundImageUrl from storage when backgroundImageId present", async () => {
    db.queryEventBySlug.mockResolvedValue({ ...baseEvent, backgroundImageId: "storage-bg-123" });
    storage.getUrl.mockResolvedValue("https://cdn.example.com/bg.jpg");

    const result = await getEventBySlugLogic(db, storage, { slug: "aminah-razak" });

    expect(result?.backgroundImageUrl).toBe("https://cdn.example.com/bg.jpg");
    expect(storage.getUrl).toHaveBeenCalledWith("storage-bg-123");
  });

  it("returns null backgroundImageUrl when no backgroundImageId", async () => {
    const result = await getEventBySlugLogic(db, storage, { slug: "aminah-razak" });
    expect(result?.backgroundImageUrl).toBe(null);
    expect(storage.getUrl).not.toHaveBeenCalled();
  });

  it("resolves donationQrUrl from storage when donationQrId present", async () => {
    db.queryEventBySlug.mockResolvedValue({ ...baseEvent, donationQrId: "storage-qr-456" });
    storage.getUrl.mockResolvedValue("https://cdn.example.com/qr.png");

    const result = await getEventBySlugLogic(db, storage, { slug: "aminah-razak" });

    expect(result?.donationQrUrl).toBe("https://cdn.example.com/qr.png");
    expect(storage.getUrl).toHaveBeenCalledWith("storage-qr-456");
  });

  it("resolves carouselImageUrls from storage for each carousel ID", async () => {
    db.queryEventBySlug.mockResolvedValue({
      ...baseEvent,
      carouselImageIds: ["storage-c1", "storage-c2", "storage-c3"],
    });
    storage.getUrl
      .mockResolvedValueOnce("https://cdn.example.com/c1.jpg")
      .mockResolvedValueOnce("https://cdn.example.com/c2.jpg")
      .mockResolvedValueOnce("https://cdn.example.com/c3.jpg");

    const result = await getEventBySlugLogic(db, storage, { slug: "aminah-razak" });

    expect(result?.carouselImageUrls).toEqual([
      "https://cdn.example.com/c1.jpg",
      "https://cdn.example.com/c2.jpg",
      "https://cdn.example.com/c3.jpg",
    ]);
  });

  it("filters out null carousel URLs (failed storage resolution)", async () => {
    db.queryEventBySlug.mockResolvedValue({
      ...baseEvent,
      carouselImageIds: ["storage-c1", "storage-c2"],
    });
    storage.getUrl
      .mockResolvedValueOnce("https://cdn.example.com/c1.jpg")
      .mockResolvedValueOnce(null);

    const result = await getEventBySlugLogic(db, storage, { slug: "aminah-razak" });
    expect(result?.carouselImageUrls).toEqual(["https://cdn.example.com/c1.jpg"]);
  });

  it("returns empty carouselImageUrls when no carousel images", async () => {
    const result = await getEventBySlugLogic(db, storage, { slug: "aminah-razak" });
    expect(result?.carouselImageUrls).toEqual([]);
  });

  it("returns bank details (bankName, bankAccount, bankHolder) in public result", async () => {
    db.queryEventBySlug.mockResolvedValue({
      ...baseEvent,
      bankName: "Maybank",
      bankAccount: "1234567890",
      bankHolder: "Aminah binti Hassan",
    });

    const result = await getEventBySlugLogic(db, storage, { slug: "aminah-razak" });

    expect(result?.bankName).toBe("Maybank");
    expect(result?.bankAccount).toBe("1234567890");
    expect(result?.bankHolder).toBe("Aminah binti Hassan");
  });

  it("returns all expected public fields", async () => {
    db.queryEventBySlug.mockResolvedValue({
      ...baseEvent,
      venueName: "Grand Ballroom KLCC",
      venueAddress: "50088 Kuala Lumpur",
      locationWaze: "https://waze.com/ul/abc",
      colorAccent: "#c9a86c",
      rsvpDeadline: "2026-08-01",
    });

    const result = await getEventBySlugLogic(db, storage, { slug: "aminah-razak" });

    expect(result?._id).toBe("event-123");
    expect(result?.coupleName).toBe("Aminah & Razak");
    expect(result?.weddingDate).toBe("2026-08-15");
    expect(result?.language).toBe("ms");
    expect(result?.published).toBe(true);
    expect(result?.venueName).toBe("Grand Ballroom KLCC");
    expect(result?.venueAddress).toBe("50088 Kuala Lumpur");
    expect(result?.locationWaze).toBe("https://waze.com/ul/abc");
    expect(result?.colorAccent).toBe("#c9a86c");
    expect(result?.rsvpDeadline).toBe("2026-08-01");
  });
});

describe("guest: updateCarouselImages business logic", () => {
  const authUser: AuthUser = { _id: "user-123" };
  const eventId = "event-456";

  let db: {
    queryManagerByEventAndUser: ReturnType<typeof vi.fn<(eventId: string, userId: string) => Promise<{ userId: string } | null>>>;
    patchEvent: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    db = {
      queryManagerByEventAndUser: vi.fn().mockResolvedValue({ userId: "user-123" }),
      patchEvent: vi.fn().mockResolvedValue(undefined),
    };
  });

  it("throws when unauthenticated", async () => {
    await expect(
      updateCarouselImagesLogic(db, null, { eventId, imageIds: [] })
    ).rejects.toThrow("Unauthorized");
    expect(db.patchEvent).not.toHaveBeenCalled();
  });

  it("throws when caller is not a manager", async () => {
    db.queryManagerByEventAndUser.mockResolvedValue(null);
    await expect(
      updateCarouselImagesLogic(db, authUser, { eventId, imageIds: ["s1"] })
    ).rejects.toThrow("Unauthorized: not a manager of this event");
    expect(db.patchEvent).not.toHaveBeenCalled();
  });

  it("throws when imageIds exceeds 10", async () => {
    const tooMany = Array.from({ length: 11 }, (_, i) => `storage-${i}`);
    await expect(
      updateCarouselImagesLogic(db, authUser, { eventId, imageIds: tooMany })
    ).rejects.toThrow("Maximum 10 carousel images allowed");
    expect(db.patchEvent).not.toHaveBeenCalled();
  });

  it("accepts exactly 10 images", async () => {
    const exactly10 = Array.from({ length: 10 }, (_, i) => `storage-${i}`);
    await updateCarouselImagesLogic(db, authUser, { eventId, imageIds: exactly10 });
    expect(db.patchEvent).toHaveBeenCalledOnce();
  });

  it("accepts empty array (clearing all carousel images)", async () => {
    await updateCarouselImagesLogic(db, authUser, { eventId, imageIds: [] });
    expect(db.patchEvent).toHaveBeenCalledOnce();
    const patch = db.patchEvent.mock.calls[0][1];
    expect(patch.carouselImageIds).toEqual([]);
  });

  it("patches event with the provided imageIds", async () => {
    const ids = ["storage-a", "storage-b"];
    await updateCarouselImagesLogic(db, authUser, { eventId, imageIds: ids });
    const patch = db.patchEvent.mock.calls[0][1];
    expect(patch.carouselImageIds).toEqual(ids);
  });
});
