"use client";

import { useParams } from "next/navigation";
import { usePaginatedQuery, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import { useState, useCallback, useEffect } from "react";
import { isValidEmail } from "@/lib/utils/validateEmail";
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
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Plus,
  Upload,
  Download,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { GuestImportModal } from "@/components/features/guests/GuestImportModal";
import { GuestListTable } from "@/components/features/guests/GuestListTable";

const GUESTS_PAGE_SIZE = 100;

export default function GuestsPage() {
  const params = useParams();
  const eventId = params.eventId as Id<"events">;
  const { t } = useTranslation();
  const { results: guests, status, loadMore, isLoading } = usePaginatedQuery(
    api.guests.listGuestsPaginated,
    { eventId },
    { initialNumItems: GUESTS_PAGE_SIZE }
  );
  const analytics = useQuery(api.guests.getRSVPAnalytics, { eventId });
  const [exportRequested, setExportRequested] = useState(false);
  const guestsForExport = useQuery(
    api.guests.listGuests,
    exportRequested ? { eventId } : "skip"
  );
  const addGuest = useMutation(api.guests.addGuest);
  const importGuests = useMutation(api.guests.importGuests);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{
    imported: number;
    errors: string[];
  } | null>(null);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMaxPax, setFormMaxPax] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState<
    "all" | "attending" | "pending" | "not_attending"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "rsvp">("name");
  const [addError, setAddError] = useState<string | null>(null);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    try {
      await addGuest({
        eventId,
        name: formName.trim(),
        phone: formPhone.trim() || undefined,
        email: formEmail.trim() || undefined,
        maxPax: formMaxPax,
      });
      setFormName("");
      setFormPhone("");
      setFormEmail("");
      setFormMaxPax(10);
      setAddModalOpen(false);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : t("guests.add_error"));
    }
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      setImportError(null);
      setImportResult(null);
      try {
        const XLSX = await import("xlsx");
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<string[]>(sheet, {
          header: 1,
          defval: "",
        }) as (string | number)[][];

        if (rows.length < 2) {
          setImportError("File has no data rows");
          return;
        }

        const headers = (rows[0] as string[]).map((h) =>
          String(h || "").toLowerCase().trim()
        );
        const nameIdx = headers.findIndex(
          (h) => h === "name" || h === "nama" || h === "nama tetamu"
        );
        const phoneIdx = headers.findIndex(
          (h) => h === "phone" || h === "telefon" || h === "no telefon"
        );
        const emailIdx = headers.findIndex(
          (h) => h === "email" || h === "emel"
        );
        const paxIdx = headers.findIndex(
          (h) => h === "pax" || h === "bilangan"
        );

        if (nameIdx < 0) {
          setImportError("Column 'Name' or 'Nama' is required");
          return;
        }

        const guestRows: { name: string; phone?: string; email?: string; maxPax?: number }[] = [];
        const parseErrors: string[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i] as (string | number)[];
          const name = String(row[nameIdx] ?? "").trim();
          if (!name) continue;
          const phone = phoneIdx >= 0 ? String(row[phoneIdx] ?? "").trim() : undefined;
          const emailRaw = emailIdx >= 0 ? String(row[emailIdx] ?? "").trim() : undefined;
          const email = emailRaw || undefined;
          if (email && !isValidEmail(email)) {
            parseErrors.push(`Row ${i + 1}: Invalid email format`);
            continue;
          }
          let maxPax: number | undefined;
          if (paxIdx >= 0 && row[paxIdx] !== undefined && row[paxIdx] !== "") {
            const n = Number(row[paxIdx]);
            if (!isNaN(n) && n >= 1 && n <= 10) maxPax = n;
          }
          guestRows.push({ name, phone: phone || undefined, email: email || undefined, maxPax });
        }
        if (parseErrors.length > 0) {
          setImportError(parseErrors.slice(0, 5).join("; "));
          if (guestRows.length === 0) return;
        }

        if (guestRows.length === 0) {
          setImportError("No valid guest rows found");
          return;
        }

        const result = await importGuests({ eventId, guests: guestRows });
        setImportResult(result);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : "Import failed");
      }
    },
    [eventId, importGuests]
  );

  useEffect(() => {
    if (!exportRequested || guestsForExport === undefined) return;
    if (guestsForExport.length === 0) {
      setExportRequested(false);
      return;
    }
    setExportRequested(false);
    const XLSX = import("xlsx");
    const rows = [
      ["Name", "Phone", "Email", "Max Pax", "RSVP Status", "Pax Count"],
      ...guestsForExport.map((g) => [
        g.name,
        g.phone ?? "",
        g.email ?? "",
        g.maxPax ?? 10,
        g.rsvpStatus
          ? g.rsvpStatus.attending
            ? "Attending"
            : "Not Attending"
          : "Pending",
        g.rsvpStatus?.attending ? g.rsvpStatus.paxCount : "",
      ]),
    ];
    XLSX.then((mod) => {
      const ws = mod.utils.aoa_to_sheet(rows);
      const wb = mod.utils.book_new();
      mod.utils.book_append_sheet(wb, ws, "Guests");
      mod.writeFile(wb, "guests.xlsx");
    });
  }, [exportRequested, guestsForExport]);

  const handleExport = useCallback(() => {
    if (!guests || guests.length === 0) return;
    setExportRequested(true);
  }, [guests]);

  const isExporting = exportRequested && guestsForExport === undefined;

  const filteredAndSortedGuests = (guests ?? [])
    .filter((g) => {
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const match =
          g.name.toLowerCase().includes(q) ||
          (g.email?.toLowerCase().includes(q) ?? false) ||
          (g.phone?.includes(q) ?? false);
        if (!match) return false;
      }
      if (rsvpFilter !== "all") {
        if (rsvpFilter === "attending" && !g.rsvpStatus?.attending) return false;
        if (rsvpFilter === "not_attending" && (!g.rsvpStatus || g.rsvpStatus.attending))
          return false;
        if (rsvpFilter === "pending" && g.rsvpStatus) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      }
      const statusA = a.rsvpStatus?.attending ? 2 : a.rsvpStatus ? 1 : 0;
      const statusB = b.rsvpStatus?.attending ? 2 : b.rsvpStatus ? 1 : 0;
      return statusB - statusA;
    });

  if (analytics === undefined || (isLoading && !guests?.length)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">{t("guests.title")}</h1>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setAddModalOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {t("guests.add_guest")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setImportModalOpen(true);
              setImportError(null);
              setImportResult(null);
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            {t("guests.import_excel")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={guests.length === 0 || isExporting}
          >
            {isExporting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t("guests.export_preparing")}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                {t("guests.export_excel")}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <UserCheck className="h-4 w-4" />
              {t("guests.analytics_attending")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics?.totalAttending ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Users className="h-4 w-4" />
              {t("guests.analytics_pax")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics?.totalPax ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <UserX className="h-4 w-4" />
              {t("guests.analytics_not_attending")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {analytics?.totalNotAttending ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Clock className="h-4 w-4" />
              {t("guests.analytics_pending")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{analytics?.totalPending ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={t("guests.search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={rsvpFilter}
          onChange={(e) =>
            setRsvpFilter(
              e.target.value as "all" | "attending" | "pending" | "not_attending"
            )
          }
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="all">{t("guests.filter_all")}</option>
          <option value="attending">{t("guests.attending")}</option>
          <option value="pending">{t("guests.pending")}</option>
          <option value="not_attending">{t("guests.not_attending")}</option>
        </select>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "rsvp")}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="name">{t("guests.sort_name")}</option>
            <option value="rsvp">{t("guests.sort_rsvp")}</option>
          </select>
        </div>
      </div>

      <GuestListTable guests={filteredAndSortedGuests} />
      {status === "CanLoadMore" && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={() => loadMore(GUESTS_PAGE_SIZE)}
          >
            {t("guests.load_more")}
          </Button>
        </div>
      )}

      <Dialog
        open={addModalOpen}
        onOpenChange={(open) => {
          setAddModalOpen(open);
          if (!open) setAddError(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("guests.add_guest_modal_title")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddGuest} className="flex flex-col gap-4">
            {addError && (
              <p className="text-sm text-red-600">{addError}</p>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium">
                {t("guests.name")} *
              </label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Ahmad"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {t("guests.phone")}
              </label>
              <Input
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="0123456789"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {t("guests.email")}
              </label>
              <Input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="ahmad@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {t("guests.pax")} (1-10)
              </label>
              <Input
                type="number"
                min={1}
                max={10}
                value={formMaxPax}
                onChange={(e) =>
                  setFormMaxPax(Math.min(10, Math.max(1, Number(e.target.value) || 1)))
                }
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <GuestImportModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        importError={importError}
        importResult={importResult}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
}
