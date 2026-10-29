import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { connectDB, describeDbError } from "@/lib/db";
import User from "@/models/User";
import {
  COOKIE_NAME,
  SESSION_SECONDS,
  assertAuthConfig,
  cookieOptions,
  createToken,
} from "@/lib/auth";
import { cleanEmail, cleanText, isValidEmail, passwordIssue } from "@/lib/validation";
import { clientIp, rateLimit, tooMany } from "@/lib/rateLimit";

const DUPLICATE = {
  message: "An account with this email already exists.",
  errors: { email: "This email is already registered." },
};

export async function POST(req) {
  const rl = rateLimit(`signup:${clientIp(req)}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) return tooMany(rl.retryAfter);

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  const name = cleanText(body?.name);
  const email = cleanEmail(body?.email);
  const password = body?.password;

  const errors = {};
  if (name.length < 2) errors.name = "Please enter your full name.";
  if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";
  const pwIssue = passwordIssue(password);
  if (pwIssue) errors.password = pwIssue;
  if (Object.keys(errors).length) {
    return Response.json({ message: "Please fix the highlighted fields.", errors }, { status: 400 });
  }

  try {
    assertAuthConfig();
  } catch (err) {
    console.error("[signup] auth misconfigured:", err.message);
    return Response.json(
      { message: "Sign-up is temporarily unavailable. Please try again later." },
      { status: 500 }
    );
  }

  try {
    await connectDB();
  } catch (err) {
    console.error("[signup] database connection failed:", describeDbError(err));
    return Response.json(
      { message: "We can't reach our database right now. Please try again shortly." },
      { status: 503 }
    );
  }

  try {
    if (await User.exists({ email })) {
      return Response.json(DUPLICATE, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    let user;
    try {
      user = await User.create({ name, email, passwordHash });
    } catch (err) {
      if (err?.code === 11000) return Response.json(DUPLICATE, { status: 409 });
      throw err;
    }

    const token = await createToken({ userId: user._id, tokenVersion: user.tokenVersion });
    (await cookies()).set(COOKIE_NAME, token, cookieOptions(SESSION_SECONDS));

    return Response.json(
      { message: "Account created.", user: { id: String(user._id), name, email } },
      { status: 201 }
    );
  } catch (err) {
    console.error("[signup]", err);
    return Response.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
