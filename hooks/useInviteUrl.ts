"use client";

import { useState, useEffect } from "react";
import { siteConfig } from "@/lib/config";

/**
 * Returns the invitation URL for the given slug, dynamically resolved to the
 * current origin (localhost when local, prod domain when deployed).
 * Use this for copy link and view invitation so testing works in both environments.
 */
export function useInviteUrl(slug: string): string {
  const [inviteUrl, setInviteUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/${slug}`;
    }
    const base =
      (typeof process !== "undefined" &&
        process.env?.NEXT_PUBLIC_SITE_URL) ||
      siteConfig.url;
    return `${base}/${slug}`;
  });

  useEffect(() => {
    setInviteUrl(`${window.location.origin}/${slug}`);
  }, [slug]);

  return inviteUrl;
}
