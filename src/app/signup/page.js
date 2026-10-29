import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = { title: "Create account | Maison Aurel" };

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join to save your details and track your orders."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-clay hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
