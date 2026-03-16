import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Tests for the business logic extracted from convex/guest.ts.
 *
 * We replicate the handler logic against mocked db and storage to catch regressions.
 */

type EventDoc = {
  _id: string;
  slug: string;
  coupleName: string;
  weddingDate: string;
  weddingTime?: string;
  published: boolean;
  backgroundImageId?: string;
  [key: string]: unknown;
};

async function getEventBySlugLogic(
  db: {
    queryEventBySlug: (slug: string) => Promise<EventDoc | null>;
  },
  storage: {
    getUrl: (id: string) => Promise<string | null>;
  },
  args: { slug: string }
): Promise<(EventDoc & { backgroundImageUrl: string | null }) | null> {
  const slug = args.slug.toLowerCase().trim();
  const event = await db.queryEventBySlug(slug);

  if (!event || !event.published) return null;

  const backgroundImageUrl = event.backgroundImageId
    ? await storage.getUrl(event.backgroundImageId)
    : null;

  return {
    ...event,
    backgroundImageUrl,
  };
}

describe("guest: getEventBySlug business logic", () => {
  const publishedEvent: EventDoc = {
    _id: "event-123",
    slug: "aminah-razak",
    coupleName: "Aminah & Razak",
    weddingDate: "2026-08-15",
    weddingTime: "14:00",
    published: true,
  };

  let db: {
    queryEventBySlug: ReturnType<
      typeof vi.fn<(slug: string) => Promise<EventDoc | null>>
    >;
  };
  let storage: {
    getUrl: ReturnType<typeof vi.fn<(id: string) => Promise<string | null>>>;
  };

  beforeEach(() => {
    db = {
      queryEventBySlug: vi.fn().mockResolvedValue(publishedEvent),
    };
    storage = {
      getUrl: vi.fn().mockResolvedValue("https://convex.cloud/storage/abc"),
    };
  });

  it("returns null when event is not found", async () => {
    db.queryEventBySlug.mockResolvedValue(null);
    const result = await getEventBySlugLogic(db, storage, {
      slug: "nonexistent",
    });
    expect(result).toBe(null);
    expect(db.queryEventBySlug).toHaveBeenCalledWith("nonexistent");
  });

  it("returns null when event exists but is not published", async () => {
    db.queryEventBySlug.mockResolvedValue({
      ...publishedEvent,
      published: false,
    });
    const result = await getEventBySlugLogic(db, storage, {
      slug: "aminah-razak",
    });
    expect(result).toBe(null);
  });

  it("normalises slug to lowercase before querying", async () => {
    await getEventBySlugLogic(db, storage, { slug: "Aminah-Razak" });
    expect(db.queryEventBySlug).toHaveBeenCalledWith("aminah-razak");
  });

  it("trims slug before querying", async () => {
    await getEventBySlugLogic(db, storage, { slug: "  aminah-razak  " });
    expect(db.queryEventBySlug).toHaveBeenCalledWith("aminah-razak");
  });

  it("returns event with backgroundImageUrl when event has backgroundImageId", async () => {
    const eventWithImage = {
      ...publishedEvent,
      backgroundImageId: "storage-id-123",
    };
    db.queryEventBySlug.mockResolvedValue(eventWithImage);

    const result = await getEventBySlugLogic(db, storage, {
      slug: "aminah-razak",
    });

    expect(result).not.toBe(null);
    expect(result?.backgroundImageUrl).toBe("https://convex.cloud/storage/abc");
    expect(storage.getUrl).toHaveBeenCalledWith("storage-id-123");
  });

  it("returns event with null backgroundImageUrl when no backgroundImageId", async () => {
    const result = await getEventBySlugLogic(db, storage, {
      slug: "aminah-razak",
    });

    expect(result).not.toBe(null);
    expect(result?.backgroundImageUrl).toBe(null);
    expect(storage.getUrl).not.toHaveBeenCalled();
  });

  it("returns full event data when found and published", async () => {
    const result = await getEventBySlugLogic(db, storage, {
      slug: "aminah-razak",
    });

    expect(result).not.toBe(null);
    expect(result?.slug).toBe("aminah-razak");
    expect(result?.coupleName).toBe("Aminah & Razak");
    expect(result?.weddingDate).toBe("2026-08-15");
    expect(result?.weddingTime).toBe("14:00");
    expect(result?.published).toBe(true);
  });
});
