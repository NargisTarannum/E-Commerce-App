"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      window.location.assign("/login");
    }
  };

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium transition-colors hover:border-ink hover:bg-ink hover:text-canvas disabled:opacity-70"
    >
      <LogOut size={16} aria-hidden="true" />
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
