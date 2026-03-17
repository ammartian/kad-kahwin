"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { Doc } from "@/convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit2, Eye, EyeOff, ExternalLink } from "lucide-react";

export default function WishlistPage() {
  const params = useParams();
  const eventId = params.eventId as Id<"events">;
  const { t } = useTranslation();
  const items = useQuery(api.wishlist.listWishlistItems, {
    eventId,
    includeHidden: true,
  });
  const addItem = useMutation(api.wishlist.addWishlistItem);
  const updateItem = useMutation(api.wishlist.updateWishlistItem);
  const deleteItem = useMutation(api.wishlist.deleteWishlistItem);
  const toggleVisibility = useMutation(api.wishlist.toggleWishlistItemVisibility);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<Id<"wishlist_items"> | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addItem({
        eventId,
        title: formTitle.trim(),
        originalUrl: formUrl.trim(),
        description: formDescription.trim() || undefined,
        addedBy: "manager",
      });
      setFormTitle("");
      setFormUrl("");
      setFormDescription("");
      setAddModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      await updateItem({
        itemId: editingId,
        title: formTitle.trim(),
        originalUrl: formUrl.trim(),
        description: formDescription.trim() || undefined,
      });
      setEditModalOpen(false);
      setEditingId(null);
      setFormTitle("");
      setFormUrl("");
      setFormDescription("");
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (item: Doc<"wishlist_items">) => {
    setEditingId(item._id);
    setFormTitle(item.title);
    setFormUrl(item.originalUrl);
    setFormDescription(item.description ?? "");
    setEditModalOpen(true);
  };

  if (items === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">{t("wishlist.title")}</h1>
        <Button onClick={() => setAddModalOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t("wishlist.add_item")}
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            {t("wishlist.no_items")}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card
              key={item._id}
              className={!item.isVisible ? "opacity-60" : ""}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-medium line-clamp-2">
                    {item.title}
                  </CardTitle>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => openEdit(item)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() =>
                        toggleVisibility({
                          itemId: item._id,
                          isVisible: !item.isVisible,
                        })
                      }
                      title={item.isVisible ? t("wishlist.hide") : t("wishlist.visible")}
                    >
                      {item.isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => deleteItem({ itemId: item._id })}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {!item.isVisible && (
                  <span className="text-xs text-amber-600">
                    {t("wishlist.hidden")}
                  </span>
                )}
                {item.claimedByName && (
                  <p className="text-sm text-gray-600">
                    {t("wishlist.claimed_by", { name: item.claimedByName })}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                {item.description && (
                  <p className="mb-2 text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <a
                  href={item.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  {item.platform === "shopee"
                    ? "Shopee"
                    : item.platform === "lazada"
                      ? "Lazada"
                      : "Link"}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("wishlist.add_item")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                {t("wishlist.item_title")} *
              </label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Rice cooker"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {t("wishlist.item_url")} *
              </label>
              <Input
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://shopee.com.my/..."
                type="url"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Description (optional)
              </label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("wishlist.edit")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                {t("wishlist.item_title")} *
              </label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {t("wishlist.item_url")} *
              </label>
              <Input
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                type="url"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Description (optional)
              </label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
