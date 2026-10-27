"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  return (
    <section
      aria-labelledby="newsletter-title"
      className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-24"
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-clay">
        Stay in the loop
      </p>
      <h2
        id="newsletter-title"
        className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl"
      >
        Get 10% off your first order
      </h2>
      <p className="mx-auto mt-4 max-w-md text-muted">
        New arrivals, private sales and styling notes. No spam, unsubscribe any time.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={status === "error"}
          aria-describedby="newsletter-status"
          className="h-12 flex-1 rounded-full border border-line bg-white px-5 text-base outline-none transition-colors placeholder:text-muted focus:border-clay"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-7 text-sm font-medium text-canvas transition-colors duration-300 hover:bg-clay disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
          {status !== "loading" && (
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          )}
        </button>
      </form>

      <p
        id="newsletter-status"
        role="status"
        aria-live="polite"
        className={`mt-4 flex min-h-6 items-center justify-center gap-1.5 text-sm ${
          status === "error" ? "text-red-700" : "text-clay"
        }`}
      >
        {status === "success" && <Check size={16} aria-hidden="true" />}
        {message}
      </p>
    </section>
  );
}