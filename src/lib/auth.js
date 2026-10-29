import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "token";
export const SESSION_SECONDS = 60 * 60 * 24; // 24 hours
export const REMEMBER_SECONDS = 60 * 60 * 24 * 30; // 30 days

// Throws if JWT_SECRET is missing/weak. Call before doing work (e.g. creating
// a user) that would be left half-finished if signing the token later failed.
export function assertAuthConfig() {
  getKey();
}

function getKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set to a random string of 32+ characters");
  }
  return new TextEncoder().encode(secret);
}

// The token carries only the user id and token version, never user data.
export async function createToken({ userId, tokenVersion }, seconds = SESSION_SECONDS) {
  return new SignJWT({ tv: tokenVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime(`${seconds}s`)
    .sign(getKey());
}

export async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    return { userId: payload.sub, tokenVersion: payload.tv ?? 0 };
  } catch {
    return null;
  }
}

export function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(maxAge ? { maxAge } : {}),
  };
}

// Verifies the cookie AND that the session hasn't been revoked. Returns the
// public user object or null. Use in route handlers and server components.
export async function getCurrentUser() {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  const session = await verifyToken(jar.get(COOKIE_NAME)?.value);
  if (!session || !/^[a-f\d]{24}$/i.test(session.userId)) return null;

  const { connectDB } = await import("@/lib/db");
  const { default: User } = await import("@/models/User");
  await connectDB();
  const user = await User.findById(session.userId).lean();
  if (!user || (user.tokenVersion ?? 0) !== session.tokenVersion) return null;

  return {
    id: String(user._id),
    name: user.name || "",
    email: user.email,
    createdAt: user.createdAt ? user.createdAt.toISOString() : null,
  };
}
