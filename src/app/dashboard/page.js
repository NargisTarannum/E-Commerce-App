import { redirect } from "next/navigation";

// The old dashboard was a copy of the homepage; accounts now live at /account.
export default function DashboardPage() {
  redirect("/account");
}
