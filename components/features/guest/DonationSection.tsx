"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Check } from "lucide-react";

interface DonationSectionProps {
  donationQrUrl: string | null;
  bankName?: string;
  bankAccount?: string;
  bankHolder?: string;
  colorAccent: string;
}

export function DonationSection({
  donationQrUrl,
  bankName,
  bankAccount,
  bankHolder,
  colorAccent,
}: DonationSectionProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const hasContent =
    donationQrUrl || bankName || bankAccount || bankHolder;

  if (!hasContent) return null;

  const handleCopy = async () => {
    if (!bankAccount) return;
    try {
      await navigator.clipboard.writeText(bankAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <section className="border-t border-white/20 px-6 py-6">
      <h2
        className="mb-4 text-lg font-semibold"
        style={{ color: colorAccent }}
      >
        {t("donation.title")}
      </h2>

      <div className="flex flex-col items-center gap-4">
        {donationQrUrl && (
          <div className="relative h-48 w-48 overflow-hidden rounded-lg bg-white">
            <Image
              src={donationQrUrl}
              alt="Donation QR code"
              fill
              className="object-contain"
              sizes="192px"
            />
          </div>
        )}
        {(bankName || bankAccount || bankHolder) && (
          <div className="w-full space-y-2 rounded-lg bg-white/20 p-4">
            {bankName && (
              <p className="text-sm">
                <span className="font-medium">{t("donation.bank_name")}: </span>
                {bankName}
              </p>
            )}
            {bankAccount && (
              <div className="flex items-center gap-2">
                <p className="text-sm">
                  <span className="font-medium">
                    {t("donation.account_number")}:{" "}
                  </span>
                  {bankAccount}
                </p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded p-1 hover:bg-white/20"
                  aria-label={t("donation.copy")}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
            {bankHolder && (
              <p className="text-sm">
                <span className="font-medium">
                  {t("donation.account_holder")}:{" "}
                </span>
                {bankHolder}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
