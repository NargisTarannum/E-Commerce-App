import { NextResponse } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/auth";

// Optimistic gate only: checks the token signature/expiry. Pages and API
// routes still verify against the database (see getCurrentUser).
export async function proxy(req) {
  const { pathname, search } = req.nextUrl;
  const session = await verifyToken(req.cookies.get(COOKIE_NAME)?.value);

  if (pathname.startsWith("/account") && !session) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + search);
    const res = NextResponse.redirect(url);
    if (req.cookies.get(COOKIE_NAME)) res.cookies.delete(COOKIE_NAME);
    return res;
  }

  if ((pathname === "/login" || pathname === "/signup") && session) {
    return NextResponse.redirect(new URL("/account", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/login", "/signup"],
};
