/**
 * Converts product URLs to affiliate links for Shopee and Lazada.
 * Used by wishlist mutations before storing in database.
 */

export type AffiliatePlatform = "shopee" | "lazada" | "other";

export interface AffiliateResult {
  affiliateUrl: string;
  platform: AffiliatePlatform;
}

const SHOPEE_PATTERNS = [
  /^https?:\/\/(?:www\.)?shopee\.(?:com\.my|my|com)(?:\/.*)?$/i,
  /^https?:\/\/(?:[a-z0-9-]+\.)?shopee\.(?:com\.my|my|com)(?:\/.*)?$/i,
];

const LAZADA_PATTERNS = [
  /^https?:\/\/(?:www\.)?lazada\.(?:com\.my|my)(?:\/.*)?$/i,
  /^https?:\/\/(?:[a-z0-9-]+\.)?lazada\.(?:com\.my|my)(?:\/.*)?$/i,
];

function isShopee(url: string): boolean {
  return SHOPEE_PATTERNS.some((p) => p.test(url.trim()));
}

function isLazada(url: string): boolean {
  return LAZADA_PATTERNS.some((p) => p.test(url.trim()));
}

function appendParam(url: string, param: string, value: string): string {
  const trimmed = url.trim();
  const separator = trimmed.includes("?") ? "&" : "?";
  return `${trimmed}${separator}${encodeURIComponent(param)}=${encodeURIComponent(value)}`;
}

/**
 * Detects platform from URL and converts to affiliate link.
 * Returns original URL unchanged for unknown platforms.
 */
export function convertToAffiliateLink(url: string): AffiliateResult {
  const trimmed = url.trim();
  if (!trimmed) {
    return { affiliateUrl: trimmed, platform: "other" };
  }

  if (isShopee(trimmed)) {
    const affiliateId = process.env.SHOPEE_AFFILIATE_ID ?? "";
    const affiliateUrl = affiliateId
      ? appendParam(trimmed, "af_siteid", affiliateId)
      : trimmed;
    return { affiliateUrl, platform: "shopee" };
  }

  if (isLazada(trimmed)) {
    const affiliateId = process.env.LAZADA_AFFILIATE_ID ?? "";
    const affiliateUrl = affiliateId
      ? appendParam(trimmed, "spm", affiliateId)
      : trimmed;
    return { affiliateUrl, platform: "lazada" };
  }

  return { affiliateUrl: trimmed, platform: "other" };
}
