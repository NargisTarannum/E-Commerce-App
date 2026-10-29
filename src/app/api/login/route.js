import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import {
  COOKIE_NAME,
  REMEMBER_SECONDS,
  SESSION_SECONDS,
  cookieOptions,
  createToken,
} from "@/lib/auth";
import { cleanEmail, isValidEmail } from "@/lib/validation";
import { clientIp, rateLimit, tooMany } from "@/lib/rateLimit";

// Compared against when the email doesn't exist, so timing doesn't reveal it.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);
const INVALID = { message: "Invalid email or password." };

export async function POST(req) {
  const ip = clientIp(req);
  const ipLimit = rateLimit(`login-ip:${ip}`, { limit: 30, windowMs: 15 * 60 * 1000 });
  if (!ipLimit.allowed) return tooMany(ipLimit.retryAfter);

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  const email = cleanEmail(body?.email);
  const password = body?.password;
  const remember = body?.remember === true;

  if (!isValidEmail(email) || typeof password !== "string" || !password || password.length > 200) {
    return Response.json(INVALID, { status: 401 });
  }

  const acctLimit = rateLimit(`login-acct:${email}:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!acctLimit.allowed) return tooMany(acctLimit.retryAfter);

  try {
    await connectDB();
    const user = await User.findOne({ email }).select("+passwordHash +password");

    const hash = user?.passwordHash || user?.password || DUMMY_HASH;
    const ok = await bcrypt.compare(password, hash);
    if (!user || !ok) return Response.json(INVALID, { status: 401 });

    // Migrate legacy accounts that stored the hash in `password`.
    if (!user.passwordHash) {
      await User.updateOne(
        { _id: user._id },
        { $set: { passwordHash: hash }, $unset: { password: "" } }
      );
    }

    const seconds = remember ? REMEMBER_SECONDS : SESSION_SECONDS;
    const token = await createToken(
      { userId: user._id, tokenVersion: user.tokenVersion ?? 0 },
      seconds
    );
    // "Remember me" => persistent cookie; otherwise a browser-session cookie.
    (await cookies()).set(COOKIE_NAME, token, cookieOptions(remember ? seconds : undefined));

    return Response.json({
      message: "Login successful.",
      user: { id: String(user._id), name: user.name || "", email: user.email },
    });
  } catch (err) {
    console.error("[login]", err);
    return Response.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
