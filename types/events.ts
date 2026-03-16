import type { Doc } from "@/convex/_generated/dataModel";

/** Projected event fields returned by listMyEvents (excludes sensitive bank/donation data) */
export type ListEventItem = Pick<
  Doc<"events">,
  "_id" | "slug" | "coupleName" | "weddingDate" | "weddingTime" | "published" | "createdAt"
>;
