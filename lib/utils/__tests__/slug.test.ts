import { describe, it, expect } from "vitest";
import { toSlug } from "../slug";

describe("toSlug", () => {
  it("converts spaces to hyphens", () => {
    expect(toSlug("John & Jane")).toBe("john-jane");
  });

  it("lowercases input", () => {
    expect(toSlug("MyEvent")).toBe("myevent");
  });

  it("strips invalid chars", () => {
    expect(toSlug("event@2025!")).toBe("event2025");
  });

  it("collapses multiple hyphens", () => {
    expect(toSlug("a---b")).toBe("a-b");
  });

  it("trims leading and trailing hyphens", () => {
    expect(toSlug("-slug-")).toBe("slug");
  });

  it("handles empty string", () => {
    expect(toSlug("")).toBe("");
  });

  it("removes unicode and special chars", () => {
    expect(toSlug("café")).toBe("caf");
  });

  it("handles multiple spaces between words", () => {
    expect(toSlug("hello   world")).toBe("hello-world");
  });

  it("trims leading and trailing whitespace", () => {
    expect(toSlug("  myslug  ")).toBe("myslug");
  });
});
