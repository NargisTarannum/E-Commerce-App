import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password } = await req.json();

  const client = await clientPromise;
  const db = client.db("authDB"); // your DB name

  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser) {
    return Response.json({ message: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.collection("users").insertOne({
    email,
    password: hashedPassword,
  });

  return Response.json({ message: "User created successfully" });
}