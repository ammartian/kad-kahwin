import { describe, it, expect } from "vitest";
import { isValidHex } from "../../utils";

describe("isValidHex", () => {
  it("accepts valid 6-character hex with hash", () => {
    expect(isValidHex("#a1b2c3")).toBe(true);
  });

  it("accepts valid uppercase hex", () => {
    expect(isValidHex("#A1B2C3")).toBe(true);
  });

  it("accepts empty string as valid", () => {
    expect(isValidHex("")).toBe(true);
  });

  it("rejects hex without hash prefix", () => {
    expect(isValidHex("a1b2c3")).toBe(false);
  });

  it("rejects 3-character shorthand hex", () => {
    expect(isValidHex("#abc")).toBe(false);
  });

  it("rejects non-hex characters", () => {
    expect(isValidHex("#GGGGGG")).toBe(false);
  });

  it("trims whitespace before validating", () => {
    expect(isValidHex("  #a1b2c3  ")).toBe(true);
  });

  it("rejects hex with invalid chars after trim", () => {
    expect(isValidHex("  #xxxxxx  ")).toBe(false);
  });
});
