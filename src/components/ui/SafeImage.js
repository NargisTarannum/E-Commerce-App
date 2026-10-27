"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

export default function SafeImage({ className = "", alt = "", ...props }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 grid place-items-center bg-sand text-muted"
      >
        <ImageOff size={32} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      onError={() => setFailed(true)}
      className={className}
      {...props}
    />
  );
}