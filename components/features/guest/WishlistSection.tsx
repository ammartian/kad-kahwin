"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Plus } from "lucide-react";

interface WishlistSectionProps {
  eventId: Id<"events">;
  colorAccent: string;
  guestName?: string | null;
  onGuestNameUsed?: (name: string) => void;
}

export function WishlistSection({
  eventId,
  colorAccent,
  guestName,
  onGuestNameUsed,
}: WishlistSectionProps) {
  const { t } = useTranslation();
  const items = useQuery(api.wishlist.listWishlistItems, {
    eventId,
    includeHidden: false,
    guestName: guestName?.trim() || undefined,
  });
  const claimItem = useMutation(api.wishlist.claimWishlistItem);
  const unclaimItem = useMutation(api.wishlist.unclaimWishlistItem);
  const addItem = useMutation(api.wishlist.addWishlistItem);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimingId, setClaimingId] = useState<Id<"wishlist_items"> | null>(null);
  const [claimName, setClaimName] = useState(guestName ?? "");
  const [addTitle, setAddTitle] = useState("");
  const [addUrl, setAddUrl] = useState("");
  const [addName, setAddName] = useState(guestName ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const name = guestName ?? "";
    setClaimName(name);
    setAddName(name);
  }, [guestName]);

  const handleClaim = (itemId: Id<"wishlist_items">) => {
    setClaimingId(itemId);
    setClaimName(guestName ?? "");
    setClaimModalOpen(true);
  };

  const submitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingId || !claimName.trim()) return;
    setError(null);
    try {
      await claimItem({ itemId: claimingId, guestName: claimName.trim() });
      onGuestNameUsed?.(claimName.trim());
      setClaimModalOpen(false);
      setClaimingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim");
    }
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTitle.trim() || !addUrl.trim() || !addName.trim()) return;
    setError(null);
    try {
      await addItem({
        eventId,
        title: addTitle.trim(),
        originalUrl: addUrl.trim(),
        addedBy: "guest",
        guestName: addName.trim(),
      });
      onGuestNameUsed?.(addName.trim());
      setAddModalOpen(false);
      setAddTitle("");
      setAddUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add");
    }
  };

  if (items === undefined) return null;

  return (
    <section className="border-t border-white/20 px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2
          className="text-lg font-semibold"
          style={{ color: colorAccent }}
        >
          {t("wishlist.title")}
        </h2>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setAddModalOpen(true)}
          className="border-white/40 text-white hover:bg-white/20"
        >
          <Plus className="mr-1 h-4 w-4" />
          {t("wishlist.add_item")}
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item._id}
            className="rounded-lg bg-white/20 p-4"
          >
            <p className="font-medium">{item.title}</p>
            {item.claimedByName ? (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  {item.claimedByName === "claimed"
                    ? t("wishlist.claimed")
                    : t("wishlist.claimed_by", { name: item.claimedByName })}
                </span>
                <div className="flex gap-2">
                  {((item as { claimedByMe?: boolean }).claimedByMe ??
                    item.claimedByName !== "claimed") && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() =>
                        unclaimItem({
                          itemId: item._id,
                          guestName: (item as { claimedByMe?: boolean })
                            .claimedByMe
                            ? (guestName ?? undefined)
                            : undefined,
                        })
                      }
                    >
                      Unclaim
                    </Button>
                  )}
                  <a
                    href={item.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-300 hover:underline"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-center justify-between">
                <Button
                  size="sm"
                  style={{ backgroundColor: colorAccent }}
                  className="text-white hover:opacity-90"
                  onClick={() => handleClaim(item._id)}
                >
                  I&apos;ll buy this
                </Button>
                <a
                  href={item.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-300 hover:underline"
                >
                  View <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 font-semibold">{t("wishlist.add_item")}</h3>
            <form onSubmit={submitAdd} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t("rsvp.name_placeholder")} *
                </label>
                <Input
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t("wishlist.item_title")} *
                </label>
                <Input
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t("wishlist.item_url")} *
                </label>
                <Input
                  value={addUrl}
                  onChange={(e) => setAddUrl(e.target.value)}
                  type="url"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {claimModalOpen && claimingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 font-semibold">I&apos;ll buy this</h3>
            <form onSubmit={submitClaim} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t("rsvp.name_placeholder")} *
                </label>
                <Input
                  value={claimName}
                  onChange={(e) => setClaimName(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setClaimModalOpen(false);
                    setClaimingId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Claim</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
