"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Check } from "lucide-react";

interface DonationModalProps {
  donationQrUrl?: string | null;
  bankName?: string;
  bankAccount?: string;
  bankHolder?: string;
  colorAccent: string;
}

export function DonationModal({
  donationQrUrl,
  bankName,
  bankAccount,
  bankHolder,
  colorAccent,
}: DonationModalProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const hasContent = donationQrUrl || bankName || bankAccount || bankHolder;

  const handleCopy = async () => {
    if (!bankAccount) return;
    try {
      await navigator.clipboard.writeText(bankAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="px-6 pb-8 pt-4">
      <h2 className="mb-6 text-center text-lg font-semibold">{t("donation.title")}</h2>

      {!hasContent ? (
        <p className="text-center text-sm text-gray-400">{t("donation.empty")}</p>
      ) : (
        <div className="flex flex-col items-center gap-5">
          {donationQrUrl && (
            <div className="relative h-52 w-52 overflow-hidden rounded-2xl bg-white shadow-md">
              <Image
                src={donationQrUrl}
                alt="Donation QR code"
                fill
                className="object-contain p-2"
                sizes="208px"
              />
            </div>
          )}

          {(bankName || bankAccount || bankHolder) && (
            <div className="w-full space-y-3 rounded-2xl bg-gray-50 p-4">
              {bankName && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    {t("donation.bank_name")}
                  </p>
                  <p className="font-semibold">{bankName}</p>
                </div>
              )}
              {bankAccount && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    {t("donation.account_number")}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-lg font-bold">{bankAccount}</p>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-200"
                      style={{ color: colorAccent }}
                      aria-label={t("donation.copy")}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-500">{t("donation.copied")}</p>
                  )}
                </div>
              )}
              {bankHolder && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    {t("donation.account_holder")}
                  </p>
                  <p className="font-semibold">{bankHolder}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
