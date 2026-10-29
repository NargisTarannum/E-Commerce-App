import { redirect } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LogoutButton from "@/components/auth/LogoutButton";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "My account | Maison Aurel" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-clay">My account</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Hello, {user.name || "there"}
          </h1>

          <dl className="mt-10 divide-y divide-line rounded-3xl border border-line bg-white">
            <div className="grid gap-1 p-5 sm:grid-cols-3 sm:p-6">
              <dt className="text-sm text-muted">Name</dt>
              <dd className="text-sm font-medium sm:col-span-2">{user.name || "—"}</dd>
            </div>
            <div className="grid gap-1 p-5 sm:grid-cols-3 sm:p-6">
              <dt className="text-sm text-muted">Email</dt>
              <dd className="break-all text-sm font-medium sm:col-span-2">{user.email}</dd>
            </div>
            {joined && (
              <div className="grid gap-1 p-5 sm:grid-cols-3 sm:p-6">
                <dt className="text-sm text-muted">Member since</dt>
                <dd className="text-sm font-medium sm:col-span-2">{joined}</dd>
              </div>
            )}
          </dl>

          <div className="mt-8">
            <LogoutButton />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
