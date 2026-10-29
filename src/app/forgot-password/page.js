import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";

export const metadata = { title: "Forgot password | Maison Aurel" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Self-service password reset isn't available yet."
      footer={
        <Link href="/login" className="font-medium text-clay hover:underline">
          Back to sign in
        </Link>
      }
    >
      <p className="text-sm leading-relaxed text-muted">
        Please contact our support team and we&apos;ll help you regain access to your account.
      </p>
    </AuthShell>
  );
}
