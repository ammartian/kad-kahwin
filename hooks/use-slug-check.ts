"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const SLUG_DEBOUNCE_MS = 400;

export type SlugStatus = "idle" | "checking" | "available" | "taken" | "invalid";

export function useSlugCheck(slug: string | undefined): {
  slugToCheck: string;
  slugStatus: SlugStatus;
  slugResult: { available: boolean; reason: string } | undefined;
} {
  const [slugToCheck, setSlugToCheck] = useState("");

  const slugNormalized = slug?.toLowerCase().trim() ?? "";

  useEffect(() => {
    if (!slugNormalized) {
      const id = setTimeout(() => setSlugToCheck(""), 0);
      return () => clearTimeout(id);
    }
    const timer = setTimeout(() => setSlugToCheck(slugNormalized), SLUG_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [slugNormalized]);

  const slugResult = useQuery(
    api.events.checkSlugAvailable,
    slugToCheck ? { slug: slugToCheck } : "skip"
  );

  const slugStatus = deriveSlugStatus(
    slugToCheck,
    slugNormalized,
    slugResult,
    SLUG_PATTERN
  );

  return { slugToCheck, slugStatus, slugResult };
}

function deriveSlugStatus(
  slugToCheck: string,
  slugNormalized: string,
  slugResult: { available: boolean; reason: string } | undefined,
  pattern: RegExp
): SlugStatus {
  if (!slugToCheck || slugToCheck !== slugNormalized) return "idle";
  if (slugResult === undefined) return "checking";
  if (!pattern.test(slugToCheck)) return "invalid";
  return slugResult.available ? "available" : "taken";
}
