"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Field from "./Field";
import PasswordInput, { inputClass } from "./PasswordInput";
import PasswordStrength from "./PasswordStrength";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 2) er.name = "Please enter your full name.";
    if (!form.email.trim()) er.email = "Email is required.";
    else if (!EMAIL_RE.test(form.email.trim())) er.email = "Please enter a valid email address.";
    if (!form.password) er.password = "Password is required.";
    else if (form.password.length < 8) er.password = "Password must be at least 8 characters.";
    else if (!/[a-z]/i.test(form.password) || !/\d/.test(form.password))
      er.password = "Password must include at least one letter and one number.";
    if (!form.confirm) er.confirm = "Please confirm your password.";
    else if (form.confirm !== form.password) er.confirm = "Passwords do not match.";
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
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setMessage({ type: "error", text: data.message || "Unable to create your account." });
        setLoading(false);
        return;
      }

      setMessage({ type: "success", text: "Account created. Redirecting…" });
      window.location.assign("/account");
    } catch {
      setMessage({ type: "error", text: "Network error. Please check your connection and try again." });
      setLoading(false);
    }
  };

  const border = (key) => (errors[key] ? "border-red-600" : "border-line");

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

      <Field id="name" label="Full name" error={errors.name}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          maxLength={80}
          value={form.name}
          onChange={update("name")}
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`${inputClass} ${border("name")}`}
        />
      </Field>

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
          className={`${inputClass} ${border("email")}`}
        />
      </Field>

      <Field
        id="password"
        label="Password"
        error={errors.password}
        hint="At least 8 characters, with a letter and a number."
      >
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={form.password}
          onChange={update("password")}
          error={errors.password}
        />
        <PasswordStrength password={form.password} />
      </Field>

      <Field id="confirm" label="Confirm password" error={errors.confirm}>
        <PasswordInput
          id="confirm"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={form.confirm}
          onChange={update("confirm")}
          error={errors.confirm}
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-canvas transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
