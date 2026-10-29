"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const inputClass =
  "h-12 w-full rounded-full border bg-white px-5 text-base outline-none transition-colors placeholder:text-muted focus:border-clay";

export default function PasswordInput({ id, error, className = "", ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass} pr-12 ${error ? "border-red-600" : "border-line"} ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:text-ink"
      >
        {visible ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
      </button>
    </div>
  );
}
