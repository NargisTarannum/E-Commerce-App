import { siteConfig } from "@/lib/data";

export default function AnnouncementBar() {
  return (
    <div className="bg-ink px-4 py-2.5 text-center text-xs font-medium tracking-wide text-canvas sm:text-sm">
      <p>{siteConfig.announcement}</p>
    </div>
  );
}