const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72; // bcrypt ignores bytes beyond 72

export function cleanText(value, max = 80) {
  if (typeof value !== "string") return "";
  // strip control characters and angle brackets, collapse whitespace
  return value
    .replace(/[\u0000-\u001f\u007f<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function cleanEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase().slice(0, 254) : "";
}

export function isValidEmail(email) {
  return EMAIL_RE.test(email);
}

export function passwordIssue(password) {
  if (typeof password !== "string" || !password) return "Password is required.";
  if (password.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters.`;
  if (new TextEncoder().encode(password).length > PASSWORD_MAX) return "Password is too long.";
  if (!/[a-z]/i.test(password) || !/\d/.test(password))
    return "Password must include at least one letter and one number.";
  return null;
}

// Product ids come from the catalog API as positive integers.
export function parseProductId(value) {
  const n = typeof value === "string" && /^\d{1,6}$/.test(value) ? Number(value) : value;
  return Number.isInteger(n) && n > 0 && n <= 999999 ? n : null;
}

// Only allow same-site relative redirects.
export function safeNext(next, fallback = "/account") {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//") || next.includes("\\"))
    return fallback;
  return next;
}
