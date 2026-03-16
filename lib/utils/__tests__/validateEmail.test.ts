import { describe, it, expect } from "vitest";
import { isValidEmail, normaliseEmail } from "../validateEmail";

describe("isValidEmail", () => {
  it("accepts a standard valid email", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  it("accepts email with subdomain", () => {
    expect(isValidEmail("user@mail.example.com")).toBe(true);
  });

  it("accepts email with plus addressing", () => {
    expect(isValidEmail("user+tag@example.com")).toBe(true);
  });

  it("rejects email missing @ symbol", () => {
    expect(isValidEmail("userexample.com")).toBe(false);
  });

  it("rejects email missing domain", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  it("rejects email missing local part", () => {
    expect(isValidEmail("@example.com")).toBe(false);
  });

  it("rejects email with spaces", () => {
    expect(isValidEmail("user @example.com")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("rejects email missing TLD", () => {
    expect(isValidEmail("user@example")).toBe(false);
  });
});

describe("normaliseEmail", () => {
  it("lowercases uppercase input", () => {
    expect(normaliseEmail("USER@EXAMPLE.COM")).toBe("user@example.com");
  });

  it("trims leading and trailing whitespace", () => {
    expect(normaliseEmail("  user@example.com  ")).toBe("user@example.com");
  });

  it("trims and lowercases combined", () => {
    expect(normaliseEmail("  USER@EXAMPLE.COM  ")).toBe("user@example.com");
  });

  it("preserves already-normalised email unchanged", () => {
    expect(normaliseEmail("user@example.com")).toBe("user@example.com");
  });
});
