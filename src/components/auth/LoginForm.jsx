"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Field from "./Field";
import PasswordInput, { inputClass } from "./PasswordInput";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function LoginForm({ next = "/account" }) {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // { type, text }
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.email.trim()) er.email = "Email is required.";
    else if (!EMAIL_RE.test(form.email.trim())) er.email = "Please enter a valid email address.";
    if (!form.password) er.password = "Password is required.";
    return er;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setMessage(null);

    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          remember: form.remember,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage({ type: "error", text: data.message || "Unable to sign in. Please try again." });
        setLoading(false);
        return;
      }

      setMessage({ type: "success", text: "Signed in. Redirecting…" });
      // Full navigation so the server sees the new cookie.
      window.location.assign(next);
    } catch {
      setMessage({ type: "error", text: "Network error. Please check your connection and try again." });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div aria-live="polite">
        {message && (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={`rounded-2xl px-4 py-3 text-sm ${
              message.type === "error"
                ? "bg-red-50 text-red-800"
                : "bg-green-50 text-green-800"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>

      <Field id="email" label="Email address" error={errors.email}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={update("email")}
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`${inputClass} ${errors.email ? "border-red-600" : "border-line"}`}
        />
      </Field>

      <Field
        id="password"
        label="Password"
        error={errors.password}
        action={
          <Link href="/forgot-password" className="text-sm text-clay hover:underline">
            Forgot password?
          </Link>
        }
      >
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={form.password}
          onChange={update("password")}
          error={errors.password}
        />
      </Field>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          checked={form.remember}
          onChange={update("remember")}
          className="h-4 w-4 accent-clay"
        />
        Remember me for 30 days
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-canvas transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
