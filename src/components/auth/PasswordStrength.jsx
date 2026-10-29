const LEVELS = [
  { label: "Too weak", bar: "bg-red-600" },
  { label: "Weak", bar: "bg-red-600" },
  { label: "Fair", bar: "bg-amber-500" },
  { label: "Good", bar: "bg-lime-600" },
  { label: "Strong", bar: "bg-green-700" },
];

export function scorePassword(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length < 8) return Math.min(score, 1);
  return Math.min(score, 4);
}

export default function PasswordStrength({ password }) {
  if (!password) return null;
  const score = scorePassword(password);
  const level = LEVELS[score];

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= score ? level.bar : "bg-line"}`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-muted">
        Password strength: <span className="font-medium text-ink">{level.label}</span>
      </p>
    </div>
  );
}
