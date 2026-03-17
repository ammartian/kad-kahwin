"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Plus, ShoppingBag } from "lucide-react";

interface WishlistModalProps {
  eventId: Id<"events">;
  colorAccent: string;
  guestName?: string | null;
  onGuestNameUsed?: (name: string) => void;
}

type Platform = "shopee" | "lazada" | "other";

const PLATFORM_COLORS: Record<Platform, string> = {
  shopee: "#f53d2d",
  lazada: "#0f146d",
  other: "#6b7280",
};

export function WishlistModal({
  eventId,
  colorAccent,
  guestName,
  onGuestNameUsed,
}: WishlistModalProps) {
  const { t } = useTranslation();
  const items = useQuery(api.wishlist.listWishlistItems, {
    eventId,
    includeHidden: false,
    guestName: guestName?.trim() || undefined,
  });
  const claimItem = useMutation(api.wishlist.claimWishlistItem);
  const unclaimItem = useMutation(api.wishlist.unclaimWishlistItem);
  const addItem = useMutation(api.wishlist.addWishlistItem);

  const [claimingId, setClaimingId] = useState<Id<"wishlist_items"> | null>(null);
  const [claimName, setClaimName] = useState(guestName ?? "");
  const [claimError, setClaimError] = useState<string | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState(guestName ?? "");
  const [addTitle, setAddTitle] = useState("");
  const [addUrl, setAddUrl] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    if (guestName) {
      setClaimName(guestName);
      setAddName(guestName);
    }
  }, [guestName]);

  const handleClaim = (itemId: Id<"wishlist_items">) => {
    if (guestName) {
      submitClaimDirect(itemId, guestName);
    } else {
      setClaimingId(itemId);
      setClaimName("");
      setClaimError(null);
    }
  };

  const submitClaimDirect = async (itemId: Id<"wishlist_items">, name: string) => {
    setClaimError(null);
    try {
      await claimItem({ itemId, guestName: name.trim() });
      onGuestNameUsed?.(name.trim());
      setClaimingId(null);
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : t("wishlist.already_claimed"));
    }
  };

  const submitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingId || !claimName.trim()) return;
    await submitClaimDirect(claimingId, claimName);
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTitle.trim() || !addUrl.trim() || !addName.trim()) return;
    setAddError(null);
    try {
      await addItem({
        eventId,
        title: addTitle.trim(),
        originalUrl: addUrl.trim(),
        addedBy: "guest",
        guestName: addName.trim(),
      });
      onGuestNameUsed?.(addName.trim());
      setAddOpen(false);
      setAddTitle("");
      setAddUrl("");
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add");
    }
  };

  if (items === undefined) {
    return (
      <div className="flex items-center justify-center px-6 py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800" />
      </div>
    );
  }

  return (
    <div className="px-6 pb-8 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("wishlist.title")}</h2>
        {!addOpen && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAddOpen(true)}
            className="gap-1.5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            {t("wishlist.add_gift")}
          </Button>
        )}
      </div>

      {/* Add item form */}
      {addOpen && (
        <form onSubmit={submitAdd} className="mb-4 space-y-3 rounded-2xl bg-gray-50 p-4">
          <p className="text-sm font-semibold">{t("wishlist.add_gift")}</p>
          <Input
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
            placeholder={t("wishlist.enter_name")}
            required
            className="text-sm"
          />
          <Input
            value={addTitle}
            onChange={(e) => setAddTitle(e.target.value)}
            placeholder={t("wishlist.item_title")}
            required
            className="text-sm"
          />
          <Input
            value={addUrl}
            onChange={(e) => setAddUrl(e.target.value)}
            placeholder={t("wishlist.item_url")}
            type="url"
            required
            className="text-sm"
          />
          {addError && <p className="text-xs text-red-500">{addError}</p>}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddOpen(false)}
              className="flex-1"
            >
              {t("wishlist.cancel")}
            </Button>
            <Button
              type="submit"
              size="sm"
              className="flex-1 text-white"
              style={{ backgroundColor: colorAccent }}
            >
              {t("wishlist.add_item")}
            </Button>
          </div>
        </form>
      )}

      {/* Items list */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-300" />
          <p className="text-sm text-gray-400">{t("wishlist.no_items")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const platform = item.platform as Platform;
            const isClaimedByMe = (item as { claimedByMe?: boolean }).claimedByMe;

            return (
              <div key={item._id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                {/* Platform badge */}
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="font-semibold leading-snug">{item.title}</p>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                    style={{ backgroundColor: PLATFORM_COLORS[platform] ?? PLATFORM_COLORS.other }}
                  >
                    {t(`wishlist.platform_${platform}`)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  {/* Claim state */}
                  {item.claimedByName ? (
                    <div className="flex items-center gap-2">
                      {isClaimedByMe ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unclaimItem({ itemId: item._id, guestName: guestName ?? undefined })}
                          className="text-xs"
                        >
                          {t("wishlist.unclaim_button")}
                        </Button>
                      ) : (
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                          style={{ backgroundColor: colorAccent }}
                        >
                          {t("wishlist.claimed_badge")}
                        </span>
                      )}
                    </div>
                  ) : (
                    <>
                      {claimingId === item._id ? (
                        <form onSubmit={submitClaim} className="flex flex-1 gap-2">
                          <Input
                            value={claimName}
                            onChange={(e) => setClaimName(e.target.value)}
                            placeholder={t("wishlist.enter_name")}
                            required
                            className="h-8 flex-1 text-xs"
                            autoFocus
                          />
                          <Button
                            type="submit"
                            size="sm"
                            className="h-8 text-xs text-white"
                            style={{ backgroundColor: colorAccent }}
                          >
                            OK
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs"
                            onClick={() => setClaimingId(null)}
                          >
                            ✕
                          </Button>
                        </form>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleClaim(item._id)}
                          className="text-xs text-white"
                          style={{ backgroundColor: colorAccent }}
                        >
                          {t("wishlist.claim_button")}
                        </Button>
                      )}
                    </>
                  )}

                  {/* Buy button */}
                  <a
                    href={item.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
                  >
                    {t("wishlist.buy_button")}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {claimError && claimingId === item._id && (
                  <p className="mt-1 text-xs text-red-500">{claimError}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
