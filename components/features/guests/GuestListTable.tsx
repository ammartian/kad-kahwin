"use client";

import { useTranslation } from "react-i18next";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type GuestWithRsvp = {
  _id: Id<"guests">;
  name: string;
  phone?: string;
  email?: string;
  maxPax?: number;
  rsvpStatus: {
    attending: boolean;
    paxCount: number;
    submittedAt: number;
  } | null;
};

interface GuestListTableProps {
  guests: GuestWithRsvp[];
}

export function GuestListTable({ guests }: GuestListTableProps) {
  const { t } = useTranslation();
  const deleteGuest = useMutation(api.guests.deleteGuest);

  if (guests.length === 0) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="p-8 text-center text-gray-500">
            {t("guests.no_guests")}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left font-medium">
                  {t("guests.name")}
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  {t("guests.phone")}
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  {t("guests.email")}
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  {t("guests.pax")}
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  {t("guests.rsvp_status")}
                </th>
                <th className="px-4 py-3 text-right font-medium">
                  {t("guests.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {guests.map((g) => (
                <tr key={g._id} className="border-b last:border-0">
                  <td className="px-4 py-3">{g.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {g.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {g.email ?? "—"}
                  </td>
                  <td className="px-4 py-3">{g.maxPax ?? 10}</td>
                  <td className="px-4 py-3">
                    {g.rsvpStatus ? (
                      g.rsvpStatus.attending ? (
                        <span className="text-green-600">
                          {t("guests.attending")} ({g.rsvpStatus.paxCount})
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          {t("guests.not_attending")}
                        </span>
                      )
                    ) : (
                      <span className="text-amber-600">
                        {t("guests.pending")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => deleteGuest({ guestId: g._id })}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
