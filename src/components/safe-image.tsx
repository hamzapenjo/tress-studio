"use client";

import { useState } from "react";

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
}

export function SafeImage({ src, alt, className }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center border border-neutral-500/30 bg-neutral-500/10 px-2 text-center text-[10px] tracking-[0.08em] text-neutral-500 uppercase ${className ?? ""}`}
      >
        Slika nedostupna
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
  );
}
