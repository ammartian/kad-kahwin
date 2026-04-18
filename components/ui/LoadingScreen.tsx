"use client";

import Image from "next/image";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <LogoPulse size="lg" />
    </div>
  );
}

interface LogoPulseProps {
  size?: "sm" | "lg";
}

function LogoPulse({ size = "lg" }: LogoPulseProps) {
  if (size === "sm") {
    return (
      <div className="relative flex items-center justify-center">
        <div className="absolute h-10 w-10 animate-ping rounded-full bg-primary/20" />
        <div className="absolute h-7 w-7 animate-pulse rounded-full border border-primary/40" />
        <div className="relative z-10 h-5 w-5 overflow-hidden rounded-full animate-pulse">
          <Image src="/logo.jpeg" alt="Jemputan Digital" width={20} height={20} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/20" />
      <div className="absolute h-12 w-12 animate-pulse rounded-full border-2 border-primary/40" />
      <div className="relative z-10 h-9 w-9 overflow-hidden rounded-full animate-pulse">
        <Image src="/logo.jpeg" alt="Jemputan Digital" width={36} height={36} />
      </div>
    </div>
  );
}

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className ?? ""}`}>
      <LogoPulse size="sm" />
    </div>
  );
}
