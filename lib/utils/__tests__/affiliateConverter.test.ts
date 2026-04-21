import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { convertToAffiliateLink } from "../affiliateConverter";

describe("convertToAffiliateLink", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    process.env.SHOPEE_AFFILIATE_ID = "SHOPEE123";
    process.env.LAZADA_AFFILIATE_ID = "LAZADA456";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("converts Shopee URL to affiliate link", () => {
    const url = "https://shopee.com.my/product-i.123.456";
    const result = convertToAffiliateLink(url);
    expect(result.platform).toBe("shopee");
    expect(result.affiliateUrl).toContain("af_siteid=SHOPEE123");
    expect(result.affiliateUrl).toContain("shopee.com.my");
  });

  it("converts Shopee URL with existing query params", () => {
    const url = "https://shopee.com.my/product-i.123.456?foo=bar";
    const result = convertToAffiliateLink(url);
    expect(result.platform).toBe("shopee");
    expect(result.affiliateUrl).toContain("foo=bar");
    expect(result.affiliateUrl).toContain("af_siteid=SHOPEE123");
  });

  it("converts Lazada URL to affiliate link", () => {
    const url = "https://www.lazada.com.my/products/product-name.html";
    const result = convertToAffiliateLink(url);
    expect(result.platform).toBe("lazada");
    expect(result.affiliateUrl).toContain("spm=LAZADA456");
    expect(result.affiliateUrl).toContain("lazada.com.my");
  });

  it("returns original URL for unknown platform", () => {
    const url = "https://amazon.com/product/123";
    const result = convertToAffiliateLink(url);
    expect(result.platform).toBe("other");
    expect(result.affiliateUrl).toBe(url);
  });

  it("returns original URL for non-Shopee/Lazada domains", () => {
    const url = "https://example.com/gift";
    const result = convertToAffiliateLink(url);
    expect(result.platform).toBe("other");
    expect(result.affiliateUrl).toBe(url);
  });

  it("handles empty string", () => {
    const result = convertToAffiliateLink("");
    expect(result.platform).toBe("other");
    expect(result.affiliateUrl).toBe("");
  });

  it("uses original URL when affiliate ID not set (Shopee)", () => {
    delete process.env.SHOPEE_AFFILIATE_ID;
    const url = "https://shopee.com.my/product";
    const result = convertToAffiliateLink(url);
    expect(result.platform).toBe("shopee");
    expect(result.affiliateUrl).toBe(url);
  });

  it("uses original URL when affiliate ID not set (Lazada)", () => {
    delete process.env.LAZADA_AFFILIATE_ID;
    const url = "https://www.lazada.com.my/product";
    const result = convertToAffiliateLink(url);
    expect(result.platform).toBe("lazada");
    expect(result.affiliateUrl).toBe(url);
  });
});
