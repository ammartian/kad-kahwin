"use client";

import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GuestImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importError: string | null;
  importResult: { imported: number; errors: string[] } | null;
  onFileUpload: (file: File) => void;
}

export function GuestImportModal({
  open,
  onOpenChange,
  importError,
  importResult,
  onFileUpload,
}: GuestImportModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("guests.import_modal_title")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          {t("guests.import_modal_hint")}
        </p>
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-6">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            className="w-full"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileUpload(file);
              e.target.value = "";
            }}
          />
        </div>
        {importError && (
          <p className="text-sm text-red-600">{importError}</p>
        )}
        {importResult && (
          <div className="text-sm">
            <p className="text-green-600">
              {t("guests.import_success", { count: importResult.imported })}
            </p>
            {importResult.errors.length > 0 && (
              <p className="mt-2 text-amber-600">
                {t("guests.import_errors", {
                  errors: importResult.errors.slice(0, 5).join("; "),
                })}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
