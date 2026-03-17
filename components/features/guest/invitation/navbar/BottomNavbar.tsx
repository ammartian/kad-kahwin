"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Music2, CalendarDays, QrCode, MapPin, ClipboardList, Gift } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import { BottomSheet } from "./BottomSheet";
import { MusicModal } from "./modals/MusicModal";
import { CalendarModal } from "./modals/CalendarModal";
import { DonationModal } from "./modals/DonationModal";
import { LocationModal } from "./modals/LocationModal";
import { RSVPModal } from "./modals/RSVPModal";
import { WishlistModal } from "./modals/WishlistModal";
import { extractYouTubeVideoId } from "@/lib/utils/youtube";

type ModalId = "music" | "calendar" | "donation" | "location" | "rsvp" | "wishlist";

interface BottomNavbarProps {
  eventId: Id<"events">;
  colorAccent: string;
  backgroundColor: string;
  coupleName: string;
  weddingDate: string;
  weddingTime?: string;
  venueName?: string;
  venueAddress?: string;
  locationWaze?: string;
  locationGoogle?: string;
  locationApple?: string;
  donationQrUrl?: string | null;
  bankName?: string;
  bankAccount?: string;
  bankHolder?: string;
  rsvpDeadline?: string;
  musicYoutubeUrl?: string;
  guestName?: string | null;
  onGuestNameUsed?: (name: string) => void;
}

export function BottomNavbar({
  eventId,
  colorAccent,
  backgroundColor,
  coupleName,
  weddingDate,
  weddingTime,
  venueName,
  venueAddress,
  locationWaze,
  locationGoogle,
  locationApple,
  donationQrUrl,
  bankName,
  bankAccount,
  bankHolder,
  rsvpDeadline,
  musicYoutubeUrl,
  guestName,
  onGuestNameUsed,
}: BottomNavbarProps) {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState<ModalId | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoId = musicYoutubeUrl ? extractYouTubeVideoId(musicYoutubeUrl) : null;

  const openModal = (id: ModalId) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  const toggleMusic = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow || !videoId) return;
    const func = isPlaying ? "pauseVideo" : "playVideo";
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func, args: "" }),
      "*"
    );
    setIsPlaying((p) => !p);
  }, [isPlaying, videoId]);

  const navItems: {
    id: ModalId;
    icon: React.ReactNode;
    label: string;
  }[] = [
    { id: "music", icon: <Music2 className="h-5 w-5" />, label: t("navbar.music") },
    { id: "calendar", icon: <CalendarDays className="h-5 w-5" />, label: t("navbar.calendar") },
    { id: "donation", icon: <QrCode className="h-5 w-5" />, label: t("navbar.donation") },
    { id: "location", icon: <MapPin className="h-5 w-5" />, label: t("navbar.location") },
    { id: "rsvp", icon: <ClipboardList className="h-5 w-5" />, label: t("navbar.rsvp") },
    { id: "wishlist", icon: <Gift className="h-5 w-5" />, label: t("navbar.wishlist") },
  ];

  const navBg = `${backgroundColor}cc`;

  return (
    <>
      {/* Hidden YouTube iframe for music */}
      {videoId && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&disablekb=1&modestbranding=1&enablejsapi=1`}
          title="Wedding music"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="fixed bottom-0 left-0 h-0 w-0 border-0 opacity-0"
        />
      )}

      {/* Navbar */}
      <div
        className="fixed bottom-0 left-1/2 z-30 flex h-16 w-full max-w-[390px] -translate-x-1/2 items-center justify-around border-t border-white/10 px-2 backdrop-blur-md"
        style={{ backgroundColor: navBg }}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => openModal(item.id)}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-1 transition-opacity hover:opacity-80 active:opacity-60"
            style={{ color: activeModal === item.id ? colorAccent : "currentColor" }}
          >
            {item.icon}
            <span className="text-[10px] font-medium leading-none">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Modals */}
      <BottomSheet isOpen={activeModal === "music"} onClose={closeModal}>
        <MusicModal
          isPlaying={isPlaying}
          onToggle={toggleMusic}
          colorAccent={colorAccent}
          hasMusic={!!videoId}
        />
      </BottomSheet>

      <BottomSheet isOpen={activeModal === "calendar"} onClose={closeModal}>
        <CalendarModal
          coupleName={coupleName}
          weddingDate={weddingDate}
          weddingTime={weddingTime}
          venueName={venueName}
          venueAddress={venueAddress}
          colorAccent={colorAccent}
        />
      </BottomSheet>

      <BottomSheet isOpen={activeModal === "donation"} onClose={closeModal}>
        <DonationModal
          donationQrUrl={donationQrUrl}
          bankName={bankName}
          bankAccount={bankAccount}
          bankHolder={bankHolder}
          colorAccent={colorAccent}
        />
      </BottomSheet>

      <BottomSheet isOpen={activeModal === "location"} onClose={closeModal}>
        <LocationModal
          venueName={venueName}
          venueAddress={venueAddress}
          locationWaze={locationWaze}
          locationGoogle={locationGoogle}
          locationApple={locationApple}
          colorAccent={colorAccent}
        />
      </BottomSheet>

      <BottomSheet isOpen={activeModal === "rsvp"} onClose={closeModal}>
        <RSVPModal
          eventId={eventId}
          rsvpDeadline={rsvpDeadline}
          colorAccent={colorAccent}
          initialGuestName={guestName}
          onSubmitted={(name) => {
            onGuestNameUsed?.(name);
            closeModal();
          }}
        />
      </BottomSheet>

      <BottomSheet isOpen={activeModal === "wishlist"} onClose={closeModal}>
        <WishlistModal
          eventId={eventId}
          colorAccent={colorAccent}
          guestName={guestName}
          onGuestNameUsed={onGuestNameUsed}
        />
      </BottomSheet>
    </>
  );
}
