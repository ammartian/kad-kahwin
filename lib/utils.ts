import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidHex(value: string): boolean {
  return value === "" || HEX_PATTERN.test(value.trim());
}

export type DateLocale = "ms-MY" | "en-MY";

export function formatEventDate(
  weddingDate: string,
  locale: DateLocale
): string | null {
  if (!weddingDate) return null;
  const date = new Date(weddingDate + "T12:00:00");
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatEventTime(weddingTime: string | undefined): string | null {
  if (!weddingTime) return null;
  const date = new Date(`1970-01-01T${weddingTime}`);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
