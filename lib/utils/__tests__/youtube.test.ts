import { describe, it, expect } from "vitest";
import { extractYouTubeVideoId } from "../youtube";

describe("extractYouTubeVideoId", () => {
  it("extracts video ID from youtube.com/watch?v= format", () => {
    expect(extractYouTubeVideoId("https://youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
  });

  it("extracts video ID from youtu.be/ format", () => {
    expect(extractYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
  });

  it("extracts video ID without protocol", () => {
    expect(extractYouTubeVideoId("youtube.com/watch?v=abc123")).toBe("abc123");
  });

  it("extracts video ID with www prefix", () => {
    expect(extractYouTubeVideoId("https://www.youtube.com/watch?v=xyz789")).toBe(
      "xyz789"
    );
  });

  it("returns null for empty string", () => {
    expect(extractYouTubeVideoId("")).toBe(null);
  });

  it("returns null for invalid URL", () => {
    expect(extractYouTubeVideoId("https://vimeo.com/123")).toBe(null);
    expect(extractYouTubeVideoId("not-a-url")).toBe(null);
    expect(extractYouTubeVideoId("https://youtube.com/playlist?list=abc")).toBe(
      null
    );
  });

  it("trims whitespace before parsing", () => {
    expect(extractYouTubeVideoId("  https://youtu.be/abc123  ")).toBe("abc123");
  });

  it("handles video IDs with hyphens", () => {
    expect(extractYouTubeVideoId("https://youtu.be/abc-123_xyz")).toBe(
      "abc-123_xyz"
    );
  });
});
