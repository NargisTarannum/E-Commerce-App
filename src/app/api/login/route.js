import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req) {
  const { email, password } = await req.json();

  const client = await clientPromise;
  const db = client.db("authDB");

  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = createToken(user);

  cookies().set("token", token, {
    httpOnly: true,
    path: "/",
  });

  return Response.json({ message: "Login successful" });
}