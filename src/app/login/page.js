import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { safeNext } from "@/lib/validation";

export const metadata = { title: "Sign in | Maison Aurel" };

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;
  const target = safeNext(Array.isArray(next) ? next[0] : next);

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to view your account and orders."
      footer={
        <>
          New to Maison Aurel?{" "}
          <Link href="/signup" className="font-medium text-clay hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm next={target} />
    </AuthShell>
  );
}
