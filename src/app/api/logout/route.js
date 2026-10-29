import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { COOKIE_NAME, cookieOptions, verifyToken } from "@/lib/auth";

export async function POST() {
  const jar = await cookies();
  const session = await verifyToken(jar.get(COOKIE_NAME)?.value);

  // Bump tokenVersion so this token (and any copy of it) stops working.
  if (session && /^[a-f\d]{24}$/i.test(session.userId)) {
    try {
      await connectDB();
      await User.updateOne(
        { _id: session.userId, tokenVersion: session.tokenVersion },
        { $inc: { tokenVersion: 1 } }
      );
    } catch (err) {
      console.error("[logout]", err);
    }
  }

  jar.set(COOKIE_NAME, "", { ...cookieOptions(), maxAge: 0 });
  return Response.json({ message: "Logged out." });
}
