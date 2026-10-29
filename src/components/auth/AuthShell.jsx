import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-10">
            <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </div>
          {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
        </div>
      </main>
      <Footer />
    </>
  );
}
