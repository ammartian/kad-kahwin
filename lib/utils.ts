import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidHex(value: string): boolean {
  return value === "" || HEX_PATTERN.test(value.trim());
}
