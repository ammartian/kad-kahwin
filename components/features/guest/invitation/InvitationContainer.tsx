"use client";

import Image from "next/image";

interface InvitationContainerProps {
  backgroundColor: string;
  backgroundImageUrl?: string | null;
  children: React.ReactNode;
}

export function InvitationContainer({
  backgroundColor,
  backgroundImageUrl,
  children,
}: InvitationContainerProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Desktop blurred background */}
      <div
        className="fixed inset-0 hidden sm:block"
        aria-hidden="true"
        style={{ backgroundColor }}
      >
        {backgroundImageUrl && (
          <Image
            src={backgroundImageUrl}
            alt=""
            fill
            className="object-cover opacity-40"
            style={{ filter: "blur(20px)" }}
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Mobile-locked frame */}
      <div className="relative z-10 mx-auto min-h-screen w-full max-w-[390px] shadow-2xl sm:my-0">
        {children}
      </div>
    </div>
  );
}
