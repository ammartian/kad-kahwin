interface IcsEventData {
  title: string;
  startDate: string;
  startTime?: string;
  venueName?: string;
  venueAddress?: string;
  description?: string;
}

function formatIcsDateTime(date: string, time?: string): string {
  const dateObj = new Date(`${date}T${time ?? "00:00"}:00`);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${dateObj.getUTCFullYear()}${pad(dateObj.getUTCMonth() + 1)}${pad(dateObj.getUTCDate())}` +
    `T${pad(dateObj.getUTCHours())}${pad(dateObj.getUTCMinutes())}00Z`
  );
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function generateIcsContent(data: IcsEventData): string {
  const dtStart = formatIcsDateTime(data.startDate, data.startTime);
  const endDate = new Date(`${data.startDate}T${data.startTime ?? "00:00"}:00`);
  endDate.setHours(endDate.getHours() + 4);
  const dtEnd = formatIcsDateTime(
    endDate.toISOString().split("T")[0],
    `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`
  );

  const location = [data.venueName, data.venueAddress]
    .filter(Boolean)
    .join(", ");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kad Kahwin//Digital Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(data.title)}`,
    location ? `LOCATION:${escapeIcsText(location)}` : null,
    data.description ? `DESCRIPTION:${escapeIcsText(data.description)}` : null,
    `UID:${Date.now()}-jemputandigital@jemputandigital.my`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter((line): line is string => line !== null)
    .join("\r\n");

  return lines;
}

export function downloadIcsFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildGoogleCalendarUrl(data: IcsEventData): string {
  const dtStart = formatIcsDateTime(data.startDate, data.startTime);
  const endDate = new Date(`${data.startDate}T${data.startTime ?? "00:00"}:00`);
  endDate.setHours(endDate.getHours() + 4);
  const dtEnd = formatIcsDateTime(
    endDate.toISOString().split("T")[0],
    `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`
  );

  const location = [data.venueName, data.venueAddress]
    .filter(Boolean)
    .join(", ");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: data.title,
    dates: `${dtStart}/${dtEnd}`,
    details: data.description ?? `Majlis perkahwinan ${data.title}`,
    ...(location && { location }),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
